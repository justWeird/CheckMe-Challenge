
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { userService, appointmentService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      try {
        // Fetch user profile and doctors
        await userService.getProfile();
        const doctorsResponse = await userService.getDoctors();
        
        setDoctors(doctorsResponse.data?.data || []);
        setIsInitialLoading(false);
      } catch (error) {
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDoctor || !date) return;
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await userService.getDoctorAvailability(selectedDoctor, formattedDate);

        console.log("Fetching availability for:", selectedDoctor, format(date, "yyyy-MM-dd"));
        console.log("Availability response:", response.data);

        console.log("Resolved time slots:", response.data?.data?.timeSlots);


        setTimeSlots(response.data?.data?.timeSlots || []);
      } catch (error) {
        toast.error("Failed to fetch doctor's availability");
      }
    };
    
    fetchAvailability();
  }, [selectedDoctor, date, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !date || !selectedTime || !age || !sex) {
      toast.error("Please complete all required fields");
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    setIsLoading(true);

    // force time to be "HH:mm"
    const padTime = (time: string) => {
      const [hour, minute = "00"] = time.split(":");
      return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    };
    
    try {
      const appointmentData = {
        doctorId: selectedDoctor,
        appointmentDate: format(date, "yyyy-MM-dd"),
        appointmentTime: padTime(selectedTime),
        comments,
        patientAge: parseInt(age),
        patientSex: sex
      };

      console.log("Final appointment payload:", appointmentData);

      await appointmentService.createAppointment(appointmentData);
      
      toast.success("Appointment booked successfully");
      navigate("/patient-dashboard");
    } catch (error) {
      toast.error("Failed to book appointment");
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-checkme-pink border-t-transparent rounded-full"></div>
      </div>
    );
  }

  console.log("Selected doctor:", selectedDoctor);
  console.log("Doctor IDs:", doctors.map(d => d._id));
  console.log("Doctor data:", doctors);
  console.log("Time slots:", timeSlots);


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate("/patient-dashboard")}
        >
          Back to Dashboard
        </Button>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">Book Your Appointment</CardTitle>
            <CardDescription className="text-center">
              Schedule a breast cancer screening appointment with one of our certified doctors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select
                    value={selectedDoctor}
                    onValueChange={setSelectedDoctor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(doctors) && doctors.map(doctor => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                          Dr. {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal pointer-events-auto",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable past dates
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {selectedDoctor && date && timeSlots.length > 0 && (
                  <div>
                    <Label>Select Time</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                      {timeSlots.map(slot => (
                        <Button
                          key={slot.time}
                          type="button"
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          className={cn(
                            "h-10",
                            !slot.available && "opacity-50 cursor-not-allowed"
                          )}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <RadioGroup value={sex} onValueChange={setSex} className="flex space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="FEMALE" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MALE" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="comments">Additional Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Any symptoms, concerns, or questions you'd like to discuss"
                    rows={4}
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-checkme-pink hover:bg-checkme-pink-dark text-white"
                disabled={isLoading || !selectedDoctor || !date || !selectedTime || !age || !sex}
              >
                {isLoading ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;
