import React from "react";
import type { Route } from "../../+types/root";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Scheduler" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const HomePage = () => {
  return (
    <div>
      <div className="w-full h-screen flex items-center justify-center gap-4">
        <Link to="/sign-in">
          <Button className="bg-blue-500 text-white">Sign In</Button>
        </Link>
        <Link to="/sign-up">
          <Button variant="outline" className="bg-blue-500 text-white">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
