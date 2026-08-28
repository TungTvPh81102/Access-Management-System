import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function CameraPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Camera Registration</h1>
        <p className="text-muted-foreground">Register camera and imaging equipment usage.</p>
      </div>

      <Card className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="size-12 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-semibold">Coming Soon</h2>
          <p className="text-sm text-muted-foreground">Camera registration feature is under development.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
