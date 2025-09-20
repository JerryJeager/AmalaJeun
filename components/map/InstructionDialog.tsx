import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

const InstructionDialog = ({
    isInstructionsOpen,
    setIsInstructionsOpen
}: {
    isInstructionsOpen: boolean
    setIsInstructionsOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <Dialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="default">Add Amala Spot</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to Add an Amala Location</DialogTitle>
            <DialogDescription>
              Follow these steps to mark and confirm an Amala spot on the map.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm text-gray-700">
            <p>1. Tap on the map to select a point. A pin will appear.</p>
            <p>2. Drag the pin around until you are happy with the location.</p>
            <p>3. Click on the pin to confirm your selection.</p>
            <p>
              4. Once confirmed, an AI chat will open where you can provide more
              details about the spot (e.g. name, specialty, opening hours).
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsInstructionsOpen(false)}
              variant="default"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

export default InstructionDialog