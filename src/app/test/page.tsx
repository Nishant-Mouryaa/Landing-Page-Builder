'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Test Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Components Test</CardTitle>
            <CardDescription>Testing if basic UI components are working</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button variant="default">Default Button</Button>
              <Button variant="primary">Primary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="secondary">Secondary Button</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Light Mode Text</h3>
                <p className="text-muted-foreground">This should be visible in light mode</p>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <h3 className="font-semibold mb-2">Card Background</h3>
                <p className="text-card-foreground">This should have card styling</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            If you can see this page with proper styling, the basic setup is working.
          </p>
        </div>
      </div>
    </div>
  );
} 