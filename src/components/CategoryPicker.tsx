import {
  Building2,
  BriefcaseBusiness,
  Car,
  CircleHelp,
  PackageSearch,
  Search,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import type { MasterRow } from "@/lib/types";

function iconForCategory(name: string): LucideIcon {
  if (name.includes("จราจร") || name.includes("อุบัติเหตุ")) return Car;
  if (name.includes("ทรัพย์สิน")) return PackageSearch;
  if (name.includes("คดี") || name.includes("อาชญากรรม")) return ShieldAlert;
  if (name.includes("ตรวจสอบ")) return Search;
  if (name.includes("หน่วยงาน") || name.includes("ตำรวจ")) return Building2;
  if (name.includes("เทศบาล") || name.includes("ภายใน")) return BriefcaseBusiness;
  return CircleHelp;
}

export function CategoryPicker({
  categories,
  selectedId,
}: {
  categories: MasterRow[];
  selectedId?: number;
}) {
  return (
    <fieldset className="category-picker span-2">
      <legend>หมวดหมู่การขอดูภาพ</legend>
      <div className="category-grid">
        {categories.map((category) => {
          const Icon = iconForCategory(category.name);

          return (
            <label className="category-option" key={category.id}>
              <input
                type="radio"
                name="category_id"
                value={category.id}
                defaultChecked={selectedId === category.id}
                required
              />
              <span className="category-visual">
                <span className="category-icon" aria-hidden="true">
                  <Icon size={19} strokeWidth={2.2} />
                </span>
                <span className="category-title">{category.name}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
