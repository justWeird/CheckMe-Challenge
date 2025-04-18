import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Calendar, Check, Clock, User, X} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "@/components/ui/sonner";
import {useAuth} from "@/contexts/AuthContext";

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    appointmentDate: string;
    appointmentTime: string;
    dateTime: string;
    status: string;
    comments: string;
    patientAge: number;
    patientSex: string;
}

const DoctorDashboard = () => {
    const {user, isLoading, logout} = useAuth();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    // 🔐 Redirect if not a doctor
    useEffect(() => {
        if (!isLoading && user?.role !== "doctor") {
            toast.error("Unauthorized. Only doctors can access this page.");
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    // 📅 Fetch appointments only if user is valid doctor
    useEffect(() => {
        const fetchAppointments = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5050/appointments/", {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setAppointments(
                    (response.data?.data || []).map(a => {
                        const dateObj = new Date(a.dateTime);
                        const statusMap: Record<string, string> = {
                            APPROVED: "CONFIRMED",
                            DECLINED: "CANCELLED",
                            CANCELLED: "CANCELLED",
                            COMPLETED: "COMPLETED",
                            PENDING: "PENDING",
                        };

                        return {
                            ...a,
                            status: statusMap[a.status?.toUpperCase()] || "PENDING", // ✅ normalize here
                            appointmentDate: dateObj.toISOString(),
                            appointmentTime: dateObj.toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                        };
                    })
                );


                console.log("Fetched appointments:", appointments);

                setDashboardLoading(false);
            } catch (error) {
                toast.error("Failed to load dashboard data");
                setDashboardLoading(false);
            }
        };

        if (!isLoading && user?.role === "doctor") {
            fetchAppointments();
        }
    }, [isLoading, user, navigate]);

    const updateAppointmentStatus = async (appointmentId: string, status: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await axios.put(
                `http://localhost:5050/appointments/${appointmentId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const statusMap: Record<string, string> = {
                APPROVED: "CONFIRMED",
                DECLINED: "CANCELLED",
                CANCELLED: "CANCELLED",
                COMPLETED: "COMPLETED",
                PENDING: "PENDING",
            };

            setAppointments(prev =>
                prev.map(a =>
                    a.id === appointmentId
                        ? { ...a, status: statusMap[status] || "PENDING" }

                        : a
                )
            );
            toast.success(`Appointment ${statusMap[status].toLowerCase()} successfully`);
        } catch (error) {
            toast.error("Failed to update appointment status");
        }
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (dashboardLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div
                    className="animate-spin h-12 w-12 border-4 border-checkme-purple border-t-transparent rounded-full"></div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Doctor's Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center">
                                <div
                                    className="w-10 h-10 rounded-full bg-checkme-purple flex items-center justify-center text-white">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <User/>}
                                </div>
                                <span className="ml-2 font-medium">Dr. {user.name}</span>
                            </div>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="bg-white p-4 mb-8 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Welcome, Dr. {user?.name || ""}
                    </h2>
                    <p className="text-gray-600">
                        Manage your appointments and patient schedules below.
                    </p>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>

                    {["pending", "confirmed", "completed", "cancelled"].map(status => (
                        <TabsContent key={status} value={status} className="space-y-4">
                            {appointments.filter(a => a.status === status.toUpperCase()).length === 0 ? (
                                <Card>
                                    <CardContent className="pt-6 text-center">
                                        <p className="text-gray-500">No {status} appointments.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                appointments
                                    .filter(a => a.status === status.toUpperCase())
                                    .map(a => (
                                        <AppointmentCard
                                            key={a.id}
                                            appointment={a}
                                            onConfirm={() => updateAppointmentStatus(a.id, "APPROVED")}
                                            onDecline={() => updateAppointmentStatus(a.id, "DECLINED")}
                                            onComplete={() => updateAppointmentStatus(a.id, "COMPLETED")}
                                            isPending={status === "pending"}
                                            isConfirmed={status === "confirmed"}
                                            isCompleted={status === "completed"}
                                            isCancelled={status === "cancelled"}
                                        />
                                    ))
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    );
};

interface AppointmentCardProps {
    appointment: Appointment;
    onConfirm?: () => void;
    onDecline?: () => void;
    onComplete?: () => void;
    isPending?: boolean;
    isConfirmed?: boolean;
    isCompleted?: boolean;
    isCancelled?: boolean;
}

const AppointmentCard = ({
                             appointment,
                             onConfirm,
                             onDecline,
                             onComplete,
                             isPending,
                             isConfirmed,
                             isCompleted,
                             isCancelled,
                         }: AppointmentCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "Invalid Date"
            : date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
    };


    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return <Badge className="bg-yellow-500">Pending</Badge>;
            case "CONFIRMED":
                return <Badge className="bg-green-500">Confirmed</Badge>;
            case "COMPLETED":
                return <Badge className="bg-blue-500">Completed</Badge>;
            case "CANCELLED":
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge className="bg-gray-500">{status}</Badge>;
        }
    };

    console.log("Date raw value:", appointment.appointmentDate);
    console.log("Time raw value:", appointment.appointmentTime);


    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">{appointment.patientName || "Patient"}</CardTitle>
                        <CardDescription>
                            <span>Age: {appointment.patientAge}</span> ·{" "}
                            <span>Sex: {appointment.patientSex}</span>
                        </CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2 text-checkme-purple"/>
                        <span>{formatDate(appointment.appointmentDate)} </span>

                    </div>
                    <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-checkme-purple"/>
                        <span>{appointment.appointmentTime}</span>
                    </div>
                </div>
                {appointment.comments && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-gray-600 text-sm">
                        <p className="font-medium mb-1">Patient Notes:</p>
                        <p>{appointment.comments}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
                {isPending && (
                    <>
                        <Button onClick={onConfirm} className="bg-green-500 text-white hover:bg-green-600">
                            <Check className="mr-2 h-4 w-4"/> Confirm
                        </Button>
                        <Button onClick={onDecline} variant="outline"
                                className="text-red-500 border-red-300 hover:bg-red-50">
                            <X className="mr-2 h-4 w-4"/> Decline
                        </Button>
                    </>
                )}
                {isConfirmed && (
                    <Button onClick={onComplete} className="bg-blue-500 text-white hover:bg-blue-600">
                        <Check className="mr-2 h-4 w-4"/> Mark Completed
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default DoctorDashboard;
