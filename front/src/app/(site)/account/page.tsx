"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);

  if (loading || !user) {
    return <p className="text-sm text-muted-foreground">Loading account...</p>;
  }

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Personal information</h1>
        <Button variant="outline" size="sm" onClick={() => setEditing((prev) => !prev)}>
          Edit
        </Button>
      </div>

      <Card className="flex flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
      </Card>

      {editing && (
        <p className="text-sm text-muted-foreground">Profile editing is coming soon.</p>
      )}
    </div>
  );
}
