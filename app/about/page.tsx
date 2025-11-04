import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bus, Radio, Smartphone, Map } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <h1 className="text-2xl font-bold text-primary uppercase tracking-wider">About Shuttle Tracker</h1>
          <p className="text-sm text-muted-foreground uppercase">Real-time college shuttle tracking system</p>
        </div>
        <main className="container max-w-4xl mx-auto">

        <Card className="overflow-hidden border-border rounded-none">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">ESP32 GPS Devices</h3>
                </div>
                <p className="text-sm">
                  Each shuttle is equipped with an ESP32 microcontroller with GPS module
                  that tracks location and speed in real-time.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Radio className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Live Data Transmission</h3>
                </div>
                <p className="text-sm">
                  GPS data is transmitted over WiFi to our API server every few seconds,
                  ensuring up-to-date location information.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Map className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Real-Time Map View</h3>
                </div>
                <p className="text-sm">
                  The web interface displays shuttle positions on an interactive map,
                  updating automatically with smooth animations.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bus className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">ETA Calculations</h3>
                </div>
                <p className="text-sm">
                  Smart algorithms calculate estimated arrival times at each stop based
                  on current location and speed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border rounded-none">
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Frontend</h4>
                <p className="text-sm">
                  Next.js 16, React 19, TailwindCSS, shadcn/ui, Leaflet Maps
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Backend</h4>
                <p className="text-sm">
                  Next.js API Routes with in-memory data storage
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Hardware</h4>
                <p className="text-sm">
                  ESP32 microcontrollers with NEO-6M GPS modules
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border rounded-none">
          <CardHeader>
            <CardTitle>College Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="font-semibold">Institution</h4>
              <p className="text-sm">
                Vellore Institute of Technology
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold">Department</h4>
              <p className="text-sm">
                Mechanical Engineering
              </p>
            </div>
    
          </CardContent>
        </Card>


        <Card className="bg-accent/20 border-accent/30 rounded-none">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              Built with love for the college community
            </p>
          </CardContent>
        </Card>
      </main>
      </div>
    </div>
  );
}
