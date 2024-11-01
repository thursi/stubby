"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import PetCreateForm from "./PetCreateForm";

type Props = {
};

const PetCreate = (props: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-red-500">Create</Button>
      </DialogTrigger>
      <DialogContent className="h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Pet</DialogTitle>
        </DialogHeader>
        <PetCreateForm
          setOpen={setOpen} reloadTable={function (): void {
            throw new Error("Function not implemented.");
          } }/>
      </DialogContent>
    </Dialog>
  );
};

export default PetCreate;
