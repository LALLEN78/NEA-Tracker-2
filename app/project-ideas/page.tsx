"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Wrench, Palette, Layers, Leaf } from "lucide-react"

// Massively expanded project ideas with sustainable materials focus
const defaultProjectIdeas = {
  "supporting-charities": [
    {
      id: "sc1",
      title: "Interactive Charity Collection Box with Digital Counter",
      description: "Smart donation box with LCD display showing running total and interactive thank you messages",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Laser cutter", "3D printer", "Arduino/microcontroller", "Soldering iron"],
      materials: ["Recycled acrylic", "Sustainable bamboo", "Electronic components", "LCD display"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "sc2",
      title: "Modular Charity Shop Display System",
      description: "Adjustable shelving and hanging system to maximize charity shop display space",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Pillar drill", "Bandsaw", "Router", "Sanders"],
      materials: ["Reclaimed timber", "Recycled metal brackets", "Eco-friendly finishes", "Sustainable fasteners"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "sc3",
      title: "Interactive Charity Information Kiosk",
      description: "Touchscreen kiosk displaying charity impact stories and donation options",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["CNC router", "3D printer", "Electronics workstation", "Programming tools"],
      materials: ["Recycled plastic housing", "Tablet/touchscreen", "Arduino", "Speakers", "RFID readers"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "sc4",
      title: "Charity Event Mobile Stage",
      description: "Portable, collapsible stage system for outdoor charity events and performances",
      materialType: "resistant",
      difficulty: "advanced",
      machinery: ["Welding equipment", "Metal cutting tools", "Hydraulic press", "Safety testing"],
      materials: [
        "Recycled aluminum tubing",
        "Reclaimed steel joints",
        "Sustainable platform boards",
        "Safety railings",
      ],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "sc5",
      title: "Volunteer Recognition Trophy System",
      description: "Modular trophy system celebrating different levels of volunteer contribution",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Laser engraver", "3D printer", "Polishing equipment", "Assembly tools"],
      materials: ["Sustainable wood", "Recycled metal", "Engraving materials", "LED components"],
      timeEstimate: "5-6 weeks",
      sustainable: true,
    },
    {
      id: "sc6",
      title: "Charity Marathon Water Station",
      description: "Efficient, eco-friendly hydration station for charity running events",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Bandsaw", "Router", "Drill press", "Waterproofing tools"],
      materials: ["Marine plywood", "Stainless steel", "Food-grade tubing", "Biodegradable cups"],
      timeEstimate: "6-7 weeks",
      sustainable: true,
    },
    {
      id: "sc7",
      title: "Digital Charity Impact Dashboard",
      description: "Real-time display showing how donations are making a difference",
      materialType: "graphics",
      difficulty: "intermediate",
      machinery: ["Large format printer", "Digital display setup", "Programming tools"],
      materials: ["LED display panels", "Mounting hardware", "Data visualization software"],
      timeEstimate: "5-6 weeks",
      sustainable: false,
    },
    {
      id: "sc8",
      title: "Charity Auction Bidding System",
      description: "Digital bidding paddles with RFID technology for silent auctions",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["3D printer", "RFID programming", "Electronics assembly", "Testing equipment"],
      materials: ["Recycled plastic filament", "RFID chips", "LED displays", "Rechargeable batteries"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
    {
      id: "sc9",
      title: "Charity Food Bank Sorting System",
      description: "Efficient sorting and inventory system for food bank donations",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Bandsaw", "Router", "Label printer", "Barcode scanner"],
      materials: ["Reclaimed plywood", "Sliding mechanisms", "Labeling system", "Storage containers"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "sc10",
      title: "Mobile Charity Information Booth",
      description: "Portable, weather-resistant information booth for outdoor events",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Welding equipment", "Fabric cutting", "Weather sealing", "Assembly tools"],
      materials: [
        "Recycled aluminum frame",
        "Weather-resistant hemp fabric",
        "Solar-powered display panels",
        "LED lighting",
      ],
      timeEstimate: "7-8 weeks",
      sustainable: true,
    },
    {
      id: "sc11",
      title: "Charity Clothing Drive Collection System",
      description: "Smart clothing collection bins with sorting guidance and inventory tracking",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Laser cutter", "3D printer", "Electronics assembly", "Programming"],
      materials: ["Recycled sheet metal", "Electronic sensors", "Display screens", "Sorting mechanisms"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "sc12",
      title: "Charity Event Ticketing Kiosk",
      description: "Self-service ticket printing and payment system for charity events",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["CNC machining", "Electronics integration", "Payment system setup", "Security testing"],
      materials: ["Sustainable bamboo housing", "Payment hardware", "Ticket printer", "Touch interface"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "sc13",
      title: "Charity Awareness Projection System",
      description: "Portable projection system for displaying charity messages on buildings",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["3D printer", "Electronics assembly", "Optics alignment", "Programming"],
      materials: [
        "Recycled plastic housing",
        "Projector components",
        "Solar-powered battery systems",
        "Control electronics",
      ],
      timeEstimate: "6-7 weeks",
      sustainable: true,
    },
    {
      id: "sc14",
      title: "Charity Shop Price Gun Upgrade",
      description: "Digital price gun system with inventory tracking and sales analytics",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["3D printer", "Electronics programming", "Database setup", "Testing equipment"],
      materials: ["Recycled plastic housing", "Database software", "Printing supplies", "Wireless components"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
    {
      id: "sc15",
      title: "Charity Event Sound System Cart",
      description: "Mobile, all-in-one sound system for outdoor charity events",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Welding", "Electronics mounting", "Acoustic testing", "Mobility testing"],
      materials: ["Reclaimed steel frame", "Audio equipment", "Weather protection", "Solar power systems"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "sc16",
      title: "Charity Volunteer Check-in System",
      description: "Digital check-in system tracking volunteer hours and contributions",
      materialType: "graphics",
      difficulty: "intermediate",
      machinery: ["Tablet setup", "Database programming", "ID card printer", "Network setup"],
      materials: ["Tablet devices", "Recycled ID card materials", "Database software", "Networking equipment"],
      timeEstimate: "5-6 weeks",
      sustainable: true,
    },
    {
      id: "sc17",
      title: "Charity Fundraising Thermometer Display",
      description: "Large-scale, updateable display showing fundraising progress toward goals",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Large format cutting", "LED programming", "Weather sealing", "Mounting systems"],
      materials: ["Recycled plastic panels", "LED strips", "Solar-powered control systems", "Mounting hardware"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "sc18",
      title: "Charity Pet Adoption Display System",
      description: "Interactive display system for animal charity adoption centers",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Digital display setup", "Database programming", "Photo equipment", "Interactive design"],
      materials: ["Digital displays", "Camera equipment", "Database software", "Interactive interfaces"],
      timeEstimate: "6-7 weeks",
      sustainable: false,
    },
    {
      id: "sc19",
      title: "Mycelium-Based Charity Collection Box",
      description: "Biodegradable donation box grown from mushroom mycelium with secure coin slot",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Mycelium growing equipment", "Molding tools", "Finishing tools", "Security hardware installation"],
      materials: ["Mushroom mycelium", "Agricultural waste", "Natural dyes", "Secure metal components"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "sc20",
      title: "Bamboo Charity Collection Tower",
      description: "Multi-level donation system with transparent tubes showing different charity projects",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Bamboo cutting tools", "Drilling equipment", "Tube forming", "Assembly tools"],
      materials: ["Sustainable bamboo", "Recycled acrylic tubes", "Sorting mechanisms", "Informational displays"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "sc21",
      title: "Interactive Charity Story Booth",
      description: "Recording booth where donors can share why they support the charity",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["CNC router", "Audio equipment setup", "Lighting systems", "Programming tools"],
      materials: ["Reclaimed wood", "Acoustic materials", "Recording equipment", "Interactive display"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
    {
      id: "sc22",
      title: "Charity Token Impact System",
      description: "Donors receive tokens to physically place in tubes representing different projects",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Laser cutter", "Acrylic forming", "Wood turning", "Assembly tools"],
      materials: ["Sustainable wood base", "Recycled acrylic tubes", "Biodegradable tokens", "Information displays"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "sc23",
      title: "Solar-Powered Charity Collection Point",
      description: "Off-grid donation station with digital display and lighting powered by solar",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Solar panel installation", "Electronics assembly", "Weather sealing", "Security systems"],
      materials: ["Solar panels", "Recycled plastic housing", "Battery storage", "LED lighting", "Security features"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "sc24",
      title: "Charity Donation Feedback System",
      description: "Interactive system that shows immediate impact of donations with sounds and visuals",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Electronics assembly", "Speaker systems", "Visual display setup", "Programming"],
      materials: ["Recycled materials housing", "Audio components", "Visual display", "Interactive elements"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
  ],
  "reducing-waste": [
    {
      id: "rw1",
      title: "Smart Recycling Bin with AI Sorting",
      description: "AI-powered bin that identifies materials and sorts them automatically",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["3D printer", "Camera setup", "AI programming", "Mechanical assembly"],
      materials: ["Recycled plastic filament", "Camera sensors", "Servo motors", "AI processing unit"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "rw2",
      title: "Upcycled Plastic Bottle Greenhouse",
      description: "Modular greenhouse system built entirely from waste plastic bottles",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Cutting tools", "Heat welding", "Frame construction", "Ventilation systems"],
      materials: ["Plastic bottles", "Connecting hardware", "Ventilation components", "Growing systems"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "rw3",
      title: "Food Waste Biogas Generator",
      description: "Small-scale biogas system converting food waste into cooking fuel",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Welding equipment", "Gas testing", "Pressure systems", "Safety equipment"],
      materials: ["Steel containers", "Gas collection systems", "Pressure gauges", "Safety valves"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "rw4",
      title: "Textile Waste Fashion Upcycling Station",
      description: "Mobile workstation for converting old clothes into trendy new items",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Sewing machines", "Cutting tools", "Heat press", "Design software"],
      materials: ["Waste textiles", "Sewing supplies", "Design materials", "Mobile cart"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "rw5",
      title: "Electronic Waste Precious Metal Extractor",
      description: "Safe system for extracting valuable metals from electronic waste",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Chemical processing", "Safety equipment", "Extraction tools", "Testing equipment"],
      materials: ["Safety chemicals", "Extraction equipment", "Protective gear", "Testing materials"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "rw6",
      title: "Waste Oil Soap Making System",
      description: "Convert waste cooking oil into useful soap products",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Heating systems", "Mixing equipment", "Molding tools", "Safety equipment"],
      materials: ["Waste cooking oil", "Soap-making chemicals", "Molds", "Safety equipment"],
      timeEstimate: "5-6 weeks",
      sustainable: true,
    },
    {
      id: "rw7",
      title: "Cardboard Waste Insulation Panels",
      description: "Convert cardboard waste into effective building insulation",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Shredding equipment", "Compression tools", "Binding systems", "Testing equipment"],
      materials: ["Cardboard waste", "Natural binders", "Compression materials", "Testing supplies"],
      timeEstimate: "6-7 weeks",
      sustainable: true,
    },
    {
      id: "rw8",
      title: "Plastic Waste 3D Printer Filament Maker",
      description: "Machine that converts plastic waste into 3D printer filament",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Shredder", "Extruder", "Temperature control", "Quality testing"],
      materials: ["Plastic waste", "Heating elements", "Extrusion dies", "Quality control tools"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "rw9",
      title: "Organic Waste Mushroom Growing System",
      description: "Convert organic waste into substrate for mushroom cultivation",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Sterilization equipment", "Growing containers", "Climate control", "Harvesting tools"],
      materials: ["Organic waste", "Mushroom spores", "Growing containers", "Climate control systems"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "rw10",
      title: "Tire Waste Playground Equipment",
      description: "Transform old tires into safe, fun playground equipment",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Cutting tools", "Cleaning equipment", "Safety testing", "Assembly tools"],
      materials: ["Waste tires", "Safety coatings", "Mounting hardware", "Protective materials"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "rw11",
      title: "Glass Waste Mosaic Art System",
      description: "Safe system for converting glass waste into decorative mosaic tiles",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Glass cutting", "Safety equipment", "Grinding tools", "Assembly systems"],
      materials: ["Glass waste", "Safety equipment", "Adhesive systems", "Protective gear"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "rw12",
      title: "Paper Waste Seed Starting Pots",
      description: "Convert paper waste into biodegradable seed starting containers",
      materialType: "crossover",
      difficulty: "basic",
      machinery: ["Pulping equipment", "Molding systems", "Drying equipment", "Quality testing"],
      materials: ["Paper waste", "Natural binders", "Molding materials", "Seeds for testing"],
      timeEstimate: "4-5 weeks",
      sustainable: true,
    },
    {
      id: "rw13",
      title: "Metal Waste Artistic Sculpture System",
      description: "Convert scrap metal into artistic sculptures and functional art",
      materialType: "resistant",
      difficulty: "advanced",
      machinery: ["Welding equipment", "Metal cutting", "Artistic tools", "Safety equipment"],
      materials: ["Scrap metal", "Welding supplies", "Artistic materials", "Protective coatings"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
    {
      id: "rw14",
      title: "Waste Plastic Outdoor Furniture",
      description: "Durable outdoor furniture made entirely from recycled plastic waste",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Plastic molding", "Cutting tools", "Assembly equipment", "Weather testing"],
      materials: ["Plastic waste", "Molding materials", "Assembly hardware", "Weather protection"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "rw15",
      title: "Compost Waste Heat Recovery System",
      description: "Capture heat from composting process for greenhouse heating",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Heat exchangers", "Piping systems", "Temperature monitoring", "Safety systems"],
      materials: ["Heat exchange materials", "Insulation", "Piping", "Monitoring equipment"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "rw16",
      title: "Waste Fabric Acoustic Panels",
      description: "Convert textile waste into effective sound dampening panels",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Cutting equipment", "Compression tools", "Acoustic testing", "Assembly systems"],
      materials: ["Textile waste", "Frame materials", "Acoustic testing equipment", "Mounting systems"],
      timeEstimate: "5-6 weeks",
      sustainable: true,
    },
    {
      id: "rw17",
      title: "Waste Wood Biomass Pellet Maker",
      description: "Convert wood waste into compressed biomass fuel pellets",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Wood chipper", "Pellet press", "Drying equipment", "Quality testing"],
      materials: ["Wood waste", "Binding agents", "Drying materials", "Testing equipment"],
      timeEstimate: "6-7 weeks",
      sustainable: true,
    },
    {
      id: "rw18",
      title: "Waste Aluminum Can Solar Heater",
      description: "Solar water heating system built from aluminum can waste",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Can preparation", "Plumbing tools", "Solar testing", "Assembly equipment"],
      materials: ["Aluminum cans", "Plumbing supplies", "Insulation", "Solar collection materials"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "rw19",
      title: "Bioplastic Production from Food Waste",
      description: "System to convert starch-rich food waste into biodegradable plastic alternatives",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Heating equipment", "Mixing systems", "Molding tools", "Testing equipment"],
      materials: ["Food waste", "Natural additives", "Molding forms", "Testing supplies"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
    {
      id: "rw20",
      title: "Mycelium Building Materials Lab",
      description: "System for growing fungal mycelium into strong, lightweight building materials",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Growing chambers", "Molding systems", "Drying equipment", "Testing tools"],
      materials: ["Mushroom spores", "Agricultural waste", "Growing containers", "Testing equipment"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "rw21",
      title: "Waste Plastic Brick Making System",
      description: "Convert mixed plastic waste into durable construction bricks",
      materialType: "resistant",
      difficulty: "advanced",
      machinery: ["Plastic shredder", "Melting equipment", "Compression molds", "Strength testing"],
      materials: ["Mixed plastic waste", "Binding agents", "Mold release", "Testing equipment"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
    {
      id: "rw22",
      title: "Coffee Grounds Upcycling Station",
      description: "Multi-purpose system for converting used coffee grounds into various products",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Drying equipment", "Mixing tools", "Molding systems", "Testing equipment"],
      materials: ["Used coffee grounds", "Natural binders", "Molding materials", "Packaging supplies"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "rw23",
      title: "Waste Vegetable Oil Biodiesel Processor",
      description: "Small-scale system for converting waste cooking oil into biodiesel fuel",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Heating systems", "Chemical processing", "Filtration equipment", "Testing tools"],
      materials: ["Waste vegetable oil", "Processing chemicals", "Filtration media", "Safety equipment"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "rw24",
      title: "Seaweed-Based Packaging System",
      description: "Process for creating biodegradable packaging from seaweed extracts",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Extraction equipment", "Drying systems", "Molding tools", "Testing equipment"],
      materials: ["Seaweed", "Natural additives", "Molding forms", "Testing supplies"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
  ],
  "home-products": [
    {
      id: "hp1",
      title: "Smart Home Energy Monitoring Hub",
      description: "Central hub monitoring all household energy consumption with AI optimization",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["3D printer", "PCB assembly", "Programming tools", "Testing equipment"],
      materials: ["Recycled plastic housing", "Electronic sensors", "Display screens", "Wireless modules"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp2",
      title: "Adaptive Furniture for Aging in Place",
      description: "Furniture that adjusts height and configuration for elderly accessibility",
      materialType: "resistant",
      difficulty: "advanced",
      machinery: ["CNC router", "Hydraulic systems", "Safety testing", "Assembly tools"],
      materials: ["Sustainable hardwood", "Hydraulic components", "Safety mechanisms", "Eco-friendly upholstery"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp3",
      title: "Home Air Quality Monitoring System",
      description: "Comprehensive air quality monitoring with automated ventilation control",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["3D printer", "Sensor calibration", "Programming", "Ventilation systems"],
      materials: ["Recycled plastic housing", "Air quality sensors", "Microcontrollers", "Ventilation components"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "hp4",
      title: "Smart Home Security Integration Hub",
      description: "Central security system integrating cameras, sensors, and smart locks",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Electronics assembly", "Network setup", "Security testing", "Programming"],
      materials: ["Recycled plastic housing", "Security cameras", "Sensors", "Smart locks"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp5",
      title: "Automated Plant Care Ecosystem",
      description: "Complete plant care system with watering, lighting, and nutrient delivery",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["3D printer", "Pump systems", "LED setup", "Sensor programming"],
      materials: ["Recycled plastic components", "Growing containers", "Pump systems", "LED grow lights"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "hp6",
      title: "Home Workshop Tool Organization System",
      description: "Smart tool organization with inventory tracking and usage monitoring",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Laser cutter", "RFID programming", "Database setup", "Assembly tools"],
      materials: ["Reclaimed wood", "RFID tags", "Tracking systems", "Display interfaces"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "hp7",
      title: "Smart Home Lighting Automation",
      description: "Intelligent lighting system that adapts to daily routines and preferences",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Electrical work", "Programming", "Sensor setup", "Network configuration"],
      materials: ["Energy-efficient LED bulbs", "Motion sensors", "Control systems", "Wiring components"],
      timeEstimate: "5-6 weeks",
      sustainable: true,
    },
    {
      id: "hp8",
      title: "Home Gym Equipment Storage System",
      description: "Space-efficient storage system for home gym equipment with easy access",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Welding", "Hydraulic systems", "Safety testing", "Assembly tools"],
      materials: ["Recycled steel tubing", "Hydraulic components", "Safety mechanisms", "Storage accessories"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "hp9",
      title: "Smart Kitchen Inventory Management",
      description: "Automated system tracking food inventory and suggesting recipes",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Barcode scanning", "Database programming", "App development", "Integration testing"],
      materials: ["Recycled plastic housing", "Scanning equipment", "Database software", "Mobile interfaces"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
    {
      id: "hp10",
      title: "Home Water Quality Monitoring System",
      description: "Comprehensive water testing and filtration system with real-time monitoring",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Plumbing tools", "Sensor calibration", "Filtration setup", "Testing equipment"],
      materials: ["Sustainable filter housing", "Water sensors", "Filtration systems", "Monitoring displays"],
      timeEstimate: "6-7 weeks",
      sustainable: true,
    },
    {
      id: "hp11",
      title: "Smart Home Climate Control System",
      description: "Intelligent HVAC system with zone control and energy optimization",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["HVAC tools", "Programming", "Sensor networks", "Energy monitoring"],
      materials: ["Energy-efficient components", "Climate sensors", "Control valves", "Smart thermostats"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp12",
      title: "Home Accessibility Ramp System",
      description: "Modular, adjustable ramp system for wheelchair and mobility aid access",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Welding", "Safety testing", "Load testing", "Assembly tools"],
      materials: ["Recycled aluminum", "Non-slip surfaces", "Safety railings", "Adjustment mechanisms"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "hp13",
      title: "Smart Home Waste Management System",
      description: "Automated waste sorting and compaction system for home use",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Mechanical systems", "Sensor programming", "Compaction equipment", "Safety testing"],
      materials: ["Recycled plastic housing", "Sorting mechanisms", "Compaction systems", "Sensors"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp14",
      title: "Home Solar Panel Cleaning Robot",
      description: "Automated robot system for cleaning and maintaining home solar panels",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Robotics programming", "Motor control", "Safety systems", "Weather testing"],
      materials: ["Recycled plastic components", "Robotic components", "Cleaning systems", "Safety sensors"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp15",
      title: "Smart Home Fire Safety System",
      description: "Integrated fire detection and suppression system with smart notifications",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Fire safety testing", "Sensor programming", "Suppression systems", "Safety certification"],
      materials: [
        "Fire-resistant sustainable materials",
        "Fire sensors",
        "Suppression equipment",
        "Notification systems",
      ],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp16",
      title: "Home Aquaponics Growing System",
      description: "Integrated fish and plant growing system for sustainable home food production",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Plumbing systems", "Pump setup", "Water testing", "Growing systems"],
      materials: ["Recycled containers", "Pump systems", "Water testing kits", "Fish and plants"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "hp17",
      title: "Smart Home Package Delivery Box",
      description: "Secure, climate-controlled delivery box with smart notifications",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Welding", "Electronics assembly", "Security testing", "Climate control"],
      materials: ["Recycled steel housing", "Security locks", "Climate control", "Notification systems"],
      timeEstimate: "6-7 weeks",
      sustainable: true,
    },
    {
      id: "hp18",
      title: "Home Wind Energy Generation System",
      description: "Small-scale wind turbine system for residential energy generation",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Turbine manufacturing", "Electrical systems", "Safety testing", "Installation tools"],
      materials: ["Recycled materials for blades", "Electrical generators", "Safety systems", "Mounting equipment"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp19",
      title: "Mycelium Home Insulation System",
      description: "Grow-your-own insulation panels using fungal mycelium and agricultural waste",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Growing chambers", "Molding systems", "Drying equipment", "Installation tools"],
      materials: ["Mushroom spores", "Agricultural waste", "Growing containers", "Installation hardware"],
      timeEstimate: "8-10 weeks",
      sustainable: true,
    },
    {
      id: "hp20",
      title: "Bamboo Modular Furniture System",
      description: "Sustainable, reconfigurable furniture system using bamboo connectors",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Bamboo cutting tools", "Drilling equipment", "Sanding tools", "Assembly jigs"],
      materials: ["Sustainable bamboo", "Natural finishes", "Eco-friendly connectors", "Organic textiles"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "hp21",
      title: "Cork Wall Tile System",
      description: "Modular, decorative wall tiles made from recycled wine corks",
      materialType: "resistant",
      difficulty: "intermediate",
      machinery: ["Cork processing tools", "Adhesive application", "Cutting equipment", "Finishing tools"],
      materials: ["Recycled wine corks", "Natural adhesives", "Backing materials", "Finishing oils"],
      timeEstimate: "5-7 weeks",
      sustainable: true,
    },
    {
      id: "hp22",
      title: "Hemp-Based Home Textiles Production",
      description: "System for creating sustainable home textiles from hemp fibers",
      materialType: "crossover",
      difficulty: "intermediate",
      machinery: ["Fiber processing", "Weaving equipment", "Dyeing systems", "Finishing tools"],
      materials: ["Hemp fibers", "Natural dyes", "Eco-friendly mordants", "Finishing materials"],
      timeEstimate: "6-8 weeks",
      sustainable: true,
    },
    {
      id: "hp23",
      title: "Recycled Paper Furniture System",
      description: "Strong, lightweight furniture made from compressed recycled paper",
      materialType: "resistant",
      difficulty: "advanced",
      machinery: ["Paper processing", "Compression equipment", "Molding tools", "Finishing systems"],
      materials: ["Recycled paper", "Natural binders", "Waterproofing agents", "Finishing materials"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
    {
      id: "hp24",
      title: "Algae-Based Air Purification System",
      description: "Living air purifier using algae to clean indoor air and produce oxygen",
      materialType: "crossover",
      difficulty: "advanced",
      machinery: ["Bioreactor setup", "Pump systems", "Lighting equipment", "Air testing tools"],
      materials: ["Algae cultures", "Growing medium", "Transparent containers", "Pump and filter systems"],
      timeEstimate: "7-9 weeks",
      sustainable: true,
    },
  ],
}

export default function ProjectIdeasPage() {
  const { toast } = useToast()
  const [projectIdeas, setProjectIdeas] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nea-tracker-project-ideas")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return defaultProjectIdeas
  })

  const [customIdeas, setCustomIdeas] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nea-tracker-custom-ideas")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return []
  })

  const [activeChallenge, setActiveChallenge] = useState("supporting-charities")
  const [filterMaterial, setFilterMaterial] = useState("all")
  const [filterSustainable, setFilterSustainable] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newIdea, setNewIdea] = useState({
    title: "",
    description: "",
    materialType: "resistant",
    difficulty: "basic",
    machinery: "",
    materials: "",
    timeEstimate: "",
    sustainable: true,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nea-tracker-project-ideas", JSON.stringify(projectIdeas))
    }
  }, [projectIdeas])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nea-tracker-custom-ideas", JSON.stringify(customIdeas))
    }
  }, [customIdeas])

  const handleAddCustomIdea = () => {
    if (!newIdea.title || !newIdea.description) {
      toast({
        title: "Error",
        description: "Please fill in title and description",
        variant: "destructive",
      })
      return
    }

    const idea = {
      ...newIdea,
      id: `custom-${Date.now()}`,
      challenge: activeChallenge,
      machinery: newIdea.machinery.split(",").map((m) => m.trim()),
      materials: newIdea.materials.split(",").map((m) => m.trim()),
      isCustom: true,
    }

    setCustomIdeas([...customIdeas, idea])
    setNewIdea({
      title: "",
      description: "",
      materialType: "resistant",
      difficulty: "basic",
      machinery: "",
      materials: "",
      timeEstimate: "",
      sustainable: true,
    })
    setShowAddForm(false)

    toast({
      title: "Success",
      description: "Custom project idea added successfully",
    })
  }

  const getFilteredIdeas = () => {
    let ideas = [
      ...(projectIdeas[activeChallenge] || []),
      ...customIdeas.filter((idea) => idea.challenge === activeChallenge),
    ]

    if (filterMaterial !== "all") {
      ideas = ideas.filter((idea) => idea.materialType === filterMaterial)
    }

    if (filterSustainable) {
      ideas = ideas.filter((idea) => idea.sustainable === true)
    }

    if (searchTerm) {
      ideas = ideas.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return ideas
  }

  const getMaterialIcon = (type) => {
    switch (type) {
      case "resistant":
        return <Wrench className="h-4 w-4" />
      case "graphics":
        return <Palette className="h-4 w-4" />
      case "crossover":
        return <Layers className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  const getMaterialColor = (type) => {
    switch (type) {
      case "resistant":
        return "bg-blue-100 text-blue-800"
      case "graphics":
        return "bg-green-100 text-green-800"
      case "crossover":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "basic":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTotalCount = () => {
    return Object.values(projectIdeas).reduce((total, ideas) => total + ideas.length, 0) + customIdeas.length
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">AQA Project Ideas Library</h1>
          <p className="text-muted-foreground">
            {getTotalCount()} comprehensive project ideas for the 2025 AQA contextual challenges
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Idea
        </Button>
      </div>

      <Tabs value={activeChallenge} onValueChange={setActiveChallenge} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="supporting-charities">
            🤝 Supporting Charities (
            {(projectIdeas["supporting-charities"]?.length || 0) +
              customIdeas.filter((i) => i.challenge === "supporting-charities").length}
            )
          </TabsTrigger>
          <TabsTrigger value="reducing-waste">
            ♻️ Reducing Waste (
            {(projectIdeas["reducing-waste"]?.length || 0) +
              customIdeas.filter((i) => i.challenge === "reducing-waste").length}
            )
          </TabsTrigger>
          <TabsTrigger value="home-products">
            🏠 Home Products (
            {(projectIdeas["home-products"]?.length || 0) +
              customIdeas.filter((i) => i.challenge === "home-products").length}
            )
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col gap-4 mt-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search project ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant={filterSustainable ? "default" : "outline"}
              onClick={() => setFilterSustainable(!filterSustainable)}
              size="sm"
              className="whitespace-nowrap"
            >
              <Leaf className="h-4 w-4 mr-1" />
              {filterSustainable ? "All Materials" : "Sustainable Only"}
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterMaterial === "all" ? "default" : "outline"}
              onClick={() => setFilterMaterial("all")}
              size="sm"
            >
              All Types
            </Button>
            <Button
              variant={filterMaterial === "resistant" ? "default" : "outline"}
              onClick={() => setFilterMaterial("resistant")}
              size="sm"
            >
              <Wrench className="h-4 w-4 mr-1" />
              Resistant Materials
            </Button>
            <Button
              variant={filterMaterial === "graphics" ? "default" : "outline"}
              onClick={() => setFilterMaterial("graphics")}
              size="sm"
            >
              <Palette className="h-4 w-4 mr-1" />
              Graphics
            </Button>
            <Button
              variant={filterMaterial === "crossover" ? "default" : "outline"}
              onClick={() => setFilterMaterial("crossover")}
              size="sm"
            >
              <Layers className="h-4 w-4 mr-1" />
              Crossover
            </Button>
          </div>
        </div>

        <TabsContent value="supporting-charities">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredIdeas().map((idea) => (
              <Card key={idea.id} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <div className="flex gap-1">
                      {idea.sustainable && (
                        <Badge variant="outline" className="bg-green-50">
                          <Leaf className="h-3 w-3 mr-1" />
                          Sustainable
                        </Badge>
                      )}
                      {idea.isCustom && <Badge variant="secondary">Custom</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getMaterialColor(idea.materialType)}>
                      {getMaterialIcon(idea.materialType)}
                      <span className="ml-1 capitalize">{idea.materialType}</span>
                    </Badge>
                    <Badge className={getDifficultyColor(idea.difficulty)}>{idea.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{idea.description}</CardDescription>

                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Machinery:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.machinery.map((machine, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {machine}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong>Materials:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.materials.map((material, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong>Time Estimate:</strong> {idea.timeEstimate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reducing-waste">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredIdeas().map((idea) => (
              <Card key={idea.id} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <div className="flex gap-1">
                      {idea.sustainable && (
                        <Badge variant="outline" className="bg-green-50">
                          <Leaf className="h-3 w-3 mr-1" />
                          Sustainable
                        </Badge>
                      )}
                      {idea.isCustom && <Badge variant="secondary">Custom</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getMaterialColor(idea.materialType)}>
                      {getMaterialIcon(idea.materialType)}
                      <span className="ml-1 capitalize">{idea.materialType}</span>
                    </Badge>
                    <Badge className={getDifficultyColor(idea.difficulty)}>{idea.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{idea.description}</CardDescription>

                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Machinery:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.machinery.map((machine, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {machine}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong>Materials:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.materials.map((material, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong>Time Estimate:</strong> {idea.timeEstimate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="home-products">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredIdeas().map((idea) => (
              <Card key={idea.id} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <div className="flex gap-1">
                      {idea.sustainable && (
                        <Badge variant="outline" className="bg-green-50">
                          <Leaf className="h-3 w-3 mr-1" />
                          Sustainable
                        </Badge>
                      )}
                      {idea.isCustom && <Badge variant="secondary">Custom</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getMaterialColor(idea.materialType)}>
                      {getMaterialIcon(idea.materialType)}
                      <span className="ml-1 capitalize">{idea.materialType}</span>
                    </Badge>
                    <Badge className={getDifficultyColor(idea.difficulty)}>{idea.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{idea.description}</CardDescription>

                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Machinery:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.machinery.map((machine, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {machine}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong>Materials:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.materials.map((material, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong>Time Estimate:</strong> {idea.timeEstimate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showAddForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add Custom Project Idea</CardTitle>
            <CardDescription>Add your own project ideas from ChatGPT research or other sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <Input
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  placeholder="Describe what students would make"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Material Type</label>
                  <select
                    value={newIdea.materialType}
                    onChange={(e) => setNewIdea({ ...newIdea, materialType: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="resistant">Resistant Materials</option>
                    <option value="graphics">Graphics</option>
                    <option value="crossover">Crossover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select
                    value={newIdea.difficulty}
                    onChange={(e) => setNewIdea({ ...newIdea, difficulty: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sustainable Materials</label>
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      checked={newIdea.sustainable}
                      onChange={(e) => setNewIdea({ ...newIdea, sustainable: e.target.checked })}
                      className="mr-2"
                    />
                    <label>Uses sustainable materials</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Machinery Required (comma separated)</label>
                <Input
                  value={newIdea.machinery}
                  onChange={(e) => setNewIdea({ ...newIdea, machinery: e.target.value })}
                  placeholder="e.g. Laser cutter, 3D printer, Bandsaw"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Materials Needed (comma separated)</label>
                <Input
                  value={newIdea.materials}
                  onChange={(e) => setNewIdea({ ...newIdea, materials: e.target.value })}
                  placeholder="e.g. MDF, Acrylic, Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time Estimate</label>
                <Input
                  value={newIdea.timeEstimate}
                  onChange={(e) => setNewIdea({ ...newIdea, timeEstimate: e.target.value })}
                  placeholder="e.g. 5-6 weeks"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddCustomIdea}>Add Project Idea</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
