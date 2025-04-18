
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-checkme-pink-light via-white to-checkme-purple-light py-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                Early Detection <br />
                <span className="text-checkme-pink">Saves Lives</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-lg">
                Empowering African women in the fight against breast cancer through accessible screening and education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button className="bg-checkme-pink hover:bg-checkme-pink-dark text-white px-8 py-3 rounded-full text-lg">
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="border-checkme-purple text-checkme-purple hover:bg-checkme-purple hover:text-white px-8 py-3 rounded-full text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/hero-image.jpg" 
                alt="Women supporting breast cancer awareness" 
                className="rounded-lg shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = "https://source.unsplash.com/random/800x600/?women,health";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            How <span className="text-checkme-pink">Checkme</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-checkme-pink-light rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-checkme-pink">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Book Appointment</h3>
              <p className="text-gray-600">Schedule a screening appointment at a time that works for you with our easy-to-use booking system.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-checkme-purple-light rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-checkme-purple">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Visit Clinic</h3>
              <p className="text-gray-600">Visit one of our partner clinics for your professional breast examination and screening.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-checkme-pink-light rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-checkme-pink">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Get Results</h3>
              <p className="text-gray-600">Receive your results and follow-up care recommendations through your secure patient dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-checkme-purple-light/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Stories from <span className="text-checkme-purple">Our Patients</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-checkme-pink-light rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Sarah M.</h4>
                  <p className="text-sm text-gray-500">Lagos, Nigeria</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Checkme made it so easy to schedule my first breast screening. The doctors were professional and kind, and I'm grateful for the peace of mind I now have."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-checkme-purple-light rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Amina K.</h4>
                  <p className="text-sm text-gray-500">Nairobi, Kenya</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "After losing my aunt to breast cancer, I knew I needed to be proactive. Checkme made the process straightforward and less intimidating."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-checkme-pink to-checkme-purple text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Take Control of Your Health Today
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Early detection is your best protection. Schedule your breast cancer screening appointment now.
          </p>
          <Link to="/login">
            <Button className="bg-white hover:bg-gray-100 text-checkme-pink px-8 py-3 rounded-full text-lg font-semibold">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
