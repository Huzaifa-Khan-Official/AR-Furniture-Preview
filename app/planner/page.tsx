import PlannerHeader from '@/components/planner/PlannerHeader'
import ARCanvas from '@/components/planner/ARCanvas'
import { PlannerProvider } from '@/context/PlannerContext'
import FurnitureSidebar from '@/components/planner/FurnitureSlider'

function PlannerInner() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-black">
      <PlannerHeader />
      <div className="flex flex-1 overflow-hidden relative">
        <FurnitureSidebar />
        <ARCanvas />
      </div>
    </div>
  )
}

export default function Planner() {
  return (
    <PlannerProvider>
      <PlannerInner />
    </PlannerProvider>
  )
}
