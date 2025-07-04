"use client";

import Preview from "@/components/preview";
import { SidebarNav } from "@/components/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import Loader from "@/components/loader";
import { setLayout, loadTemplate } from "@/store/layoutSlice";
import { useRouter } from "next/navigation";
import { setCurrentProject } from "@/store/projectSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/logo";
import UserMenu from "@/components/user-menu";
import { project, projectReducer } from "@/types/types";
import { updateProjectPublishAction } from "@/app/_actions/project";
import { Loader2, Palette } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TemplateService from "@/lib/template-service";

export default function NewLandingPageLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: any;
}) {
    const sidebarNavItems = [
        {
            title: "Navbar",
            href: `/project/edit/${params.id}`,
        },
        {
            title: "Header",
            href: `/project/edit/${params.id}/header`,
        },
        // {
        //     title: "Services",
        //     href: `/project/edit/${params.id}/services`,
        // },
        {
            title: "Footer",
            href: `/project/edit/${params.id}/footer`,
        },
    ];

    const { toast } = useToast();
    const [project, setproject] = useState<project>();
    const [templates, setTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [isLoadingTemplates, setIsLoadingTemplates] = useState<boolean>(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const getProjectDetails = async (id: string) => {
        try {
            if (!id) {
                //navigate to error page and show toast
            }

            setIsLoading(true);

            const response = await axios.get(`/api/project/${id}`);
            dispatch(setLayout(response.data.content));
            dispatch(setCurrentProject(response.data));
            setproject(response.data);
        } catch (error) {
            console.log(error);
            router.push("/dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    const loadTemplates = async () => {
        try {
            setIsLoadingTemplates(true);
            const templateList = await TemplateService.loadTemplates();
            setTemplates(templateList);
        } catch (error) {
            console.error('Error loading templates:', error);
            toast({
                title: "Error",
                description: "Failed to load templates",
                variant: "destructive",
            });
        } finally {
            setIsLoadingTemplates(false);
        }
    };

    const handleTemplateChange = async (templateId: string) => {
        try {
            if (templateId === 'default') {
                const defaultTemplate = TemplateService.getDefaultTemplate();
                dispatch(loadTemplate(defaultTemplate));
                toast({
                    title: "Template Loaded",
                    description: "Default template applied successfully",
                });
                return;
            }

            const template = await TemplateService.getTemplateById(templateId);
            if (template) {
                const templateData = {
                    styles: template.styles,
                    elements: template.elements,
                };
                dispatch(loadTemplate(templateData));
                toast({
                    title: "Template Loaded",
                    description: `${template.name} template applied successfully`,
                });
            }
        } catch (error) {
            console.error('Error loading template:', error);
            toast({
                title: "Error",
                description: "Failed to load template",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        getProjectDetails(params.id);
        loadTemplates();
    }, [params.id]);

    const handlePublish = async () => {
        try {
            if (!project) return;
            setIsPublishing(true);
            const res = await updateProjectPublishAction(params.id, !project.isPublished);
            dispatch(setCurrentProject(res));
            const proj = res as project;
            setproject(proj);
            if (proj.isPublished) {
                toast({ title: "Project Published Successfully!" });
            } else {
                toast({
                    title: "Project Unpublished Successfully!",
                    description: "Keep your project alive, showcase yourself",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsPublishing(false);
        }
    };

    if (isLoading) {
        return <Loader fill />;
    }

    return (
        <main className="w-full flex justify-center py-4 px-3 md:px-12 md:py-4">
            <Tabs defaultValue="edit" className="w-full flex flex-col items-center">
                <div className="w-full flex justify-between">
                    <div className="hidden md:block">
                        <Logo />
                    </div>

                    <TabsList className="grid md:w-[400px] grid-cols-2">
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <div className="flex space-x-4 items-center w-fit">
                        {/* Template Selector */}
                        <div className="flex items-center space-x-2">
                            <Palette className="h-4 w-4 text-muted-foreground" />
                            <Select onValueChange={handleTemplateChange} disabled={isLoadingTemplates}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={isLoadingTemplates ? "Loading..." : "Choose Template"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default Template</SelectItem>
                                    {templates.map((template) => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handlePublish}
                            className="flex items-center"
                            variant={project?.isPublished ? "destructive" : "primary"}>
                            {isPublishing && (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    &nbsp;
                                </>
                            )}
                            <span>{project?.isPublished ? "Unpublish" : "Publish"}</span>
                        </Button>
                        <UserMenu />
                    </div>
                </div>
                <TabsContent className="w-full" value="edit">
                    <div className="space-y-6 p-2 md:py-10 pb-16">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold tracking-tight">Edit</h2>
                            <p className="text-muted-foreground">
                                Manage your components and styles.
                            </p>
                        </div>
                        <Separator className="my-6" />
                        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                            <aside className="-mx-4 lg:w-1/5">
                                <SidebarNav items={sidebarNavItems} />
                            </aside>
                            <div className="flex-1 lg:max-w-2xl">{children}</div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent className="w-full" value="preview">
                    <Preview projectId={params.id} />
                </TabsContent>
            </Tabs>
        </main>
    );
}
