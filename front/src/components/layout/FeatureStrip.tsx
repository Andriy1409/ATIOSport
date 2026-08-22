import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

const FEATURES = [
  { icon: Truck, title: "Nationwide delivery", description: "Courier or pickup point, 1–3 days" },
  { icon: ShieldCheck, title: "Authentic products", description: "Sourced directly from manufacturers" },
  { icon: RotateCcw, title: "Easy returns", description: "14 days to decide" },
];

export function FeatureStrip() {
  return (
    <section className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex items-start gap-3">
          <Icon strokeWidth={2} className="mt-0.5 h-5.5 w-5.5 shrink-0 text-brand" />
          <div>
            <h3 className="mb-0.5 text-base font-semibold">{title}</h3>
            <p className="m-0 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
