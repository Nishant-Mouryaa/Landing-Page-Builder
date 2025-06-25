"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { useAuth } from "@/context/firebase-auth-provider";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedHeroSVG from "../../public/animations/AnimatedHeroSVG";

type Props = {};

const Hero = (props: Props) => {
    const { user } = useAuth();
    const [image, setImage] = useState("/animations/hero-animated-entrance.svg");
    
    useEffect(() => {
        setImage(`/animations/hero-animated-entrance.svg?v=${Math.random()}`);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <motion.div 
                className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div 
                    className="lg:w-1/2 flex flex-col space-y-6"
                    variants={itemVariants}
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full w-fit">
                        <Rocket className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">No-code landing page builder</span>
                    </div>

                    <motion.h1 
                        className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
                        variants={itemVariants}
                    >
                        Create <span className="text-primary">High-Converting</span> Landing Pages in Minutes
                    </motion.h1>

                    <motion.p 
                        className="text-lg text-muted-foreground"
                        variants={itemVariants}
                    >
                        Turn visitors into customers with our intuitive drag-and-drop builder. 
                        No coding required—just beautiful, effective landing pages that drive results.
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        {user ? (
                            <Link href="/explore">
                                <Button
                                    variant={"primary"}
                                    size="lg"
                                    className="rounded-full px-8 py-6 text-lg font-semibold group"
                                >
                                    <span>Explore Templates</span>
                                    <ArrowRight
                                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                                        size={20}
                                    />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button
                                    variant={"primary"}
                                    size="lg"
                                    className="rounded-full px-8 py-6 text-lg font-semibold group"
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight
                                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                                        size={20}
                                    />
                                </Button>
                            </Link>
                        )}
                    </motion.div>

                    <motion.div 
                        className="flex items-center gap-4 text-sm text-muted-foreground"
                        variants={itemVariants}
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div 
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-background bg-foreground/10"
                                    style={{ zIndex: i }}
                                />
                            ))}
                        </div>
                        <span>Trusted by 10,000+ marketers</span>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="lg:w-1/2"
                    variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.5,
                                delay: 0.2
                            }
                        }
                    }}
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border">
                        <AnimatedHeroSVG />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;