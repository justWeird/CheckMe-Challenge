
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, AlertCircle, User, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  dateTime: string;
  doctor: {
    name: string;
  };
  status: string;
  comments: string;
  patientAge: number;
  patientSex: string;
}

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return; // ✅ avoids running checkAuth if token is missing
    }

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch appointments
        const appointmentsResponse = await axios.get("http://localhost:5050/appointments/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Appointments API response:", appointmentsResponse.data);
        console.log("Appointments API response:", appointmentsResponse.data);

        const statusMap: Record<string, string> = {
          APPROVED: "CONFIRMED",
          DECLINED: "CANCELLED",
          CANCELLED: "CANCELLED",
          COMPLETED: "COMPLETED",
          PENDING: "PENDING",
        };

        setAppointments(
            (appointmentsResponse.data?.data || []).map(a => ({
              ...a,
              status: statusMap[a.status?.toUpperCase()] || "PENDING",
            }))
        );

        setIsLoading(false);
      } catch (error) {
        setError("Failed to load dashboard data");
        setIsLoading(false);
        // If unauthorized, redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          navigate("/login");
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const cancelAppointment = async (appointmentId: string) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      await axios.put(
        `http://localhost:5050/appointments/${appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state to reflect cancellation
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: "CANCELLED" } 
            : appointment
        )
      );
      
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleNewAppointment = () => {
    navigate("/book-appointment");
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-checkme-pink border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const normalizedAppointments = appointments.map((a) => {
    const dateObj = new Date(a.dateTime);
    return {
      ...a,
      appointmentDate: dateObj.toISOString().split("T")[0],
      appointmentTime: dateObj.toTimeString().slice(0, 5), // HH:mm
    };
  });


  console.log("Fetched appointments:", appointments);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-checkme-purple flex items-center justify-center text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User />}
                </div>
                <span className="ml-2 font-medium">{user.name || "User"}</span>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            onClick={handleNewAppointment}
            className="bg-checkme-pink hover:bg-checkme-pink-dark text-white"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Book New Appointment
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {normalizedAppointments.filter(a =>
              (a.status === "PENDING" || a.status === "CONFIRMED") && 
              new Date(a.appointmentDate) >= new Date()
            ).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">No upcoming appointments found.</p>
                </CardContent>
              </Card>
            ) : (
                normalizedAppointments
                .filter(a => 
                  (a.status === "PENDING" || a.status === "CONFIRMED") && 
                  new Date(a.appointmentDate) >= new Date()
                )
                .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                .map(appointment => (
                  <AppointmentCard 
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={() => cancelAppointment(appointment.id)}
                  />
                ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {normalizedAppointments.filter(a =>
              a.status === "COMPLETED" || 
              (new Date(a.appointmentDate) < new Date() && a.status !== "CANCELLED")
            ).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">No past appointments found.</p>
                </CardContent>
              </Card>
            ) : (
                normalizedAppointments
                .filter(a =>
                  a.status === "COMPLETED" || 
                  (new Date(a.appointmentDate) < new Date() && a.status !== "CANCELLED")
                )
                .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                .map(appointment => (
                  <AppointmentCard 
                    key={appointment.id}
                    appointment={appointment}
                    isPast
                  />
                ))
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            {normalizedAppointments.filter(a => a.status === "CANCELLED").length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">No cancelled appointments found.</p>
                </CardContent>
              </Card>
            ) : (
                normalizedAppointments
                .filter(a => a.status === "CANCELLED")
                .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                .map(appointment => (
                  <AppointmentCard 
                    key={appointment.id}
                    appointment={appointment}
                    isCancelled
                  />
                ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: () => void;
  isPast?: boolean;
  isCancelled?: boolean;
}

const AppointmentCard = ({ appointment, onCancel, isPast, isCancelled }: AppointmentCardProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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


  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Dr. {appointment.doctor?.name || "Doctor"}</CardTitle>
            <CardDescription>Appointment ID: {appointment.id.slice(0, 8)}</CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2 text-checkme-pink" />
            <span>{formatDate(appointment.appointmentDate)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2 text-checkme-pink" />
            <span>{appointment.appointmentTime}</span>
          </div>
        </div>
        
        {appointment.comments && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-gray-600 text-sm">
            <p className="font-medium mb-1">Comments:</p>
            <p>{appointment.comments}</p>
          </div>
        )}
      </CardContent>
      
      {!isPast && !isCancelled && appointment.status !== "CANCELLED" && (
        <CardFooter>
          <Button
            variant="outline"
            className="text-red-500 border-red-300 hover:bg-red-50"
            onClick={onCancel}
          >
            Cancel Appointment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PatientDashboard;
