'use client';

import * as React from "react";
import { Plus, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export function LogDriveDrawer() {
    const [hours, setHours] = React.useState([1.0]);
    const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);

    const skills = ["Highway", "Parking", "Merging", "Night Driving", "Roundabouts", "Parallel Parking"];

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleSubmit = () => {
        // Optimistic Update Login Here
        // ...
        console.log("Submitting:", { hours: hours[0], skills: selectedSkills });
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="w-full h-14 bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 text-lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Log Custom Drive
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-slate-900 border-slate-800 text-slate-50">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl font-bold">Log Lesson Details</DrawerTitle>
                        <DrawerDescription className="text-slate-400">Record today's progress.</DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-6">
                        {/* Hours Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-300">Duration (Hours)</label>
                                <span className="text-lg font-bold text-blue-400">{hours[0]} hrs</span>
                            </div>
                            <Slider
                                defaultValue={[1.0]}
                                max={2.5}
                                min={0.5}
                                step={0.25}
                                onValueChange={setHours}
                                className="py-4"
                            />
                        </div>

                        {/* Skills Chips */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300">Skills Practiced</label>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <Badge
                                        key={skill}
                                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                                        className={`cursor-pointer px-3 py-1 text-sm transition-all ${selectedSkills.includes(skill)
                                                ? "bg-blue-600 hover:bg-blue-500 border-blue-600 text-white"
                                                : "border-slate-700 text-slate-400 hover:border-slate-500"
                                            }`}
                                        onClick={() => toggleSkill(skill)}
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300">Instructor Notes</label>
                            <Textarea
                                placeholder="Feedback for parents..."
                                className="bg-slate-950 border-slate-800 text-slate-50 min-h-[100px]"
                            />
                        </div>
                    </div>

                    <DrawerFooter>
                        <Button onClick={handleSubmit} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500 text-white">
                            Submit Log
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" className="border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
