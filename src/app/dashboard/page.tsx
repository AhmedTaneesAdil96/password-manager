"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useRouter } from "next/navigation";
import { useToastContext } from "../components/ui/ToastContext";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  interface Password {
    id: number;
    service: string;
    username: string;
    revealed?: string;
    isVisible?: boolean;
  }

  const [passwords, setPasswords] = useState<Password[]>([]);
  const [form, setForm] = useState({
    service: "",
    username: "",
    password: "",
    secondPwd: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchPasswords();
    }
  }, [status]);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id?: number; service?: string }>({ isOpen: false });
  const { showToast } = useToastContext();
  async function fetchPasswords() {
    const res = await fetch("/api/passwords/list");
    if (res.ok) setPasswords(await res.json());
  }

  async function handleAdd() {
    const res = await fetch("/api/passwords/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ service: "", username: "", password: "", secondPwd: "" });
      fetchPasswords();
      setOpen(false);
      showToast("success", `${form.service} credentials were added.`); // <-- show toast
    } else {
      showToast("error", "Failed to save password."); // <-- show error toast
    }
  }

  async function revealPassword(id: number) {
    const res = await fetch("/api/passwords/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      setPasswords((prev) => prev.map((p) => (p.id === id ? { ...p, revealed: data.password, isVisible: true } : p)));
    }
  }

  async function handleDelete(id: number, service: string) {
    const res = await fetch("/api/passwords/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchPasswords();
      showToast("success", `${service} password was deleted.`);
    } else {
      showToast("error", "Failed to delete password.");
    }
  }

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔐 Password Manager</h1>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 w-full">Add New Password</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save a New Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
            <Input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input
              placeholder="Second Password (optional)"
              value={form.secondPwd}
              onChange={(e) => setForm({ ...form, secondPwd: e.target.value })}
            />
            <Button className="w-full" onClick={handleAdd}>
              Save Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 mt-6">
        {passwords.length === 0 ? (
          <p className="text-sm text-slate-500 text-center">No passwords saved yet.</p>
        ) : (
          passwords.map((p) => (
            <Card key={p.id}>
              <CardContent>
                <div className="flex justify-between items-start gap-4 bg-black-100 p-4 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-base">
                      <span className="font-semibold text-white">Service: </span>
                      <span className="text-gray-500">{p.service}</span>
                    </p>
                    <p className="text-base">
                      <span className="font-semibold text-white">Username: </span>
                      <span className="text-gray-500">{p.username}</span>
                    </p>
                    <p className="text-base font-mono mt-2">
                      <span className="font-semibold text-white">Password: </span>
                      <span className="text-gray-500">{p.isVisible && p.revealed ? p.revealed : "••••••••"}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      className="!text-black bg-white border border-black hover:bg-black hover:!text-white transition"
                      onClick={() =>
                        p.isVisible
                          ? setPasswords((prev) => prev.map((item) => (item.id === p.id ? { ...item, isVisible: false } : item)))
                          : revealPassword(p.id)
                      }>
                      {p.isVisible ? "Hide" : "Reveal"}
                    </Button>
                    <Button
                      className="bg-red-600 text-white hover:bg-red-700 transition-colors"
                      variant="default"
                      onClick={() => setDeleteDialog({ isOpen: true, id: p.id, service: p.service })}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 bg-black">
            <p className="text-sm text-center">
              Are you sure you want to delete the password for <span className="font-semibold">{deleteDialog.service}</span>? This action cannot be
              undone.
            </p>
            <div className="flex gap-2">
              {" "}
              <Button className="flex-1 text-black" variant="outline" onClick={() => setDeleteDialog({ isOpen: false })}>
                Cancel
              </Button>{" "}
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700 transition-colors"
                onClick={() => {
                  if (deleteDialog.id && deleteDialog.service) {
                    handleDelete(deleteDialog.id, deleteDialog.service);
                    setDeleteDialog({ isOpen: false });
                  }
                }}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
