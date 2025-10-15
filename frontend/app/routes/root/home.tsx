import React from "react";
import type { Route } from "../../+types/root";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import {
  Settings,
  BarChart3,
  Shield,
  Clock,
  Wrench,
  AlertTriangle,
  Users,
  Zap,
  Activity,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Star,
  Globe,
  Smartphone,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Industrial Maintenance Scheduler - Smart Task Management" },
    {
      name: "description",
      content:
        "Advanced industrial maintenance task management with real-time sensor monitoring and predictive analytics.",
    },
    {
      name: "keywords",
      content:
        "industrial maintenance, task scheduler, sensor monitoring, predictive maintenance, IoT",
    },
  ];
}

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation Header */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                MaintenancePro
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/sign-in">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-blue-100"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Zap className="h-3 w-3 mr-1" />
              Next-Gen Industrial IoT
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Smart Industrial
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                Maintenance Management
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary maintenance scheduling with real-time sensor
              monitoring, predictive analytics, and intelligent task automation
              for industrial equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* <Link to="/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
              >
                Watch Demo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button> */}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              { label: "Uptime Improved", value: "99.8%", icon: CheckCircle },
              { label: "Cost Reduction", value: "35%", icon: BarChart3 },
              { label: "Active Sensors", value: "50K+", icon: Activity },
              { label: "Industries Served", value: "200+", icon: Globe },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-2">
                  <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Complete Industrial Solution
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to optimize maintenance operations and
              maximize equipment performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Real-Time Monitoring",
                description:
                  "ADXL345 accelerometer integration with live vibration, current, and temperature monitoring",
                features: [
                  "3-axis vibration analysis",
                  "Current overload detection",
                  "Dual temperature sensors",
                ],
              },
              {
                icon: AlertTriangle,
                title: "Intelligent Alerts",
                description:
                  "Smart threshold-based notifications with industrial safety standards",
                features: [
                  "Critical alerts >12A",
                  "Vibration warnings >1.5g",
                  "Temperature alerts >60°C",
                ],
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description:
                  "Comprehensive dashboards with predictive maintenance insights",
                features: [
                  "Real-time charts",
                  "Historical trends",
                  "Performance metrics",
                ],
              },
              {
                icon: Wrench,
                title: "Task Automation",
                description:
                  "Automated maintenance scheduling based on sensor data and usage patterns",
                features: [
                  "Predictive scheduling",
                  "Resource optimization",
                  "Workflow automation",
                ],
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Multi-workspace management with role-based access control",
                features: [
                  "Team workspaces",
                  "Task assignment",
                  "Progress tracking",
                ],
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description:
                  "Industrial-grade security with data encryption and access controls",
                features: [
                  "Data encryption",
                  "User authentication",
                  "Audit trails",
                ],
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <CardHeader>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center text-gray-300 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sensor Technology Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                IoT Integration
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Advanced Sensor Technology
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Our platform integrates with industrial-grade sensors to provide
                comprehensive monitoring of your critical equipment parameters
                in real-time.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: Zap,
                    label: "Current Monitoring",
                    desc: "Electrical load analysis up to 20A threshold",
                  },
                  {
                    icon: Activity,
                    label: "Vibration Analysis",
                    desc: "3-axis ADXL345 accelerometer with 1.5g sensitivity",
                  },
                  {
                    icon: AlertTriangle,
                    label: "Temperature Control",
                    desc: "Dual sensor monitoring with 60°C safety limits",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <item.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{item.label}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/sign-up">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  Explore Technology
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 backdrop-blur-md border border-white/10">
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-semibold mb-2">
                  Live Sensor Dashboard
                </h3>
                <p className="text-gray-300 text-sm">
                  Real-time monitoring interface
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">18.5A</div>
                  <div className="text-xs text-gray-300">Current Load</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">0.8g</div>
                  <div className="text-xs text-gray-300">Vibration</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">45°C</div>
                  <div className="text-xs text-gray-300">Temp A</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">48°C</div>
                  <div className="text-xs text-gray-300">Temp B</div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Maintenance Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of industrial facilities already using MaintenancePro
            to optimize their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Link to="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
              >
                <Star className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Schedule Demo
            </Button> */}
          </div>
          {/* <p className="text-blue-200 text-sm mt-4">
            No credit card required • 30-day free trial • Setup in minutes
          </p> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  MaintenancePro
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Advanced industrial maintenance management with real-time IoT
                monitoring and predictive analytics for optimal equipment
                performance.
              </p>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Enterprise Ready</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Integration
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; 2025 MaintenancePro. All rights reserved. Built for
              industrial excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
