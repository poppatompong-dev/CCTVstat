"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, LoaderCircle, TriangleAlert } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { reorderMasterAction, saveMasterAction } from "@/app/actions";
import { moveMasterId } from "@/lib/master-order";
import type { MasterKind, MasterRow } from "@/lib/types";

type SortStatus = { tone: "success" | "error"; message: string } | null;

function SortableMasterRow({
  kind,
  position,
  row,
  disabled,
}: {
  kind: MasterKind;
  position: number;
  row: MasterRow;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
    disabled,
  });

  return (
    <form
      ref={setNodeRef}
      action={saveMasterAction.bind(null, kind)}
      className={`master-row${isDragging ? " is-dragging" : ""}`}
      data-master-id={row.id}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label={`ลากเพื่อย้ายลำดับ ${row.name}`}
        className="drag-handle"
        disabled={disabled}
        type="button"
      >
        <GripVertical aria-hidden="true" size={20} />
        <span className="order-number">{position}</span>
      </button>
      <input type="hidden" name="id" value={row.id} />
      <label className="field compact">
        <span>ชื่อ</span>
        <input name="name" defaultValue={row.name} required />
      </label>
      <label className="check-row">
        <input name="is_active" type="checkbox" defaultChecked={row.is_active} />
        <span>เปิด</span>
      </label>
      {row.semantic_key ? <span className="semantic-chip">{row.semantic_key}</span> : null}
      <button className="btn small outline" type="submit">บันทึก</button>
    </form>
  );
}

export function MasterSettings({
  title,
  description,
  kind,
  rows,
}: {
  title: string;
  description: string;
  kind: MasterKind;
  rows: MasterRow[];
}) {
  const [orderedRows, setOrderedRows] = useOptimistic<MasterRow[], MasterRow[]>(
    rows,
    (_currentRows, nextRows) => nextRows,
  );
  const [sortStatus, setSortStatus] = useState<SortStatus>(null);
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id;
    const activeId = Number(event.active.id);
    if (overId === undefined || activeId === Number(overId) || isPending) return;

    const previousRows = orderedRows;
    const nextIds = moveMasterId(
      previousRows.map((row) => row.id),
      activeId,
      Number(overId),
    );
    const rowsById = new Map(previousRows.map((row) => [row.id, row]));
    const nextRows = nextIds.map((id, index) => ({
      ...rowsById.get(id)!,
      sort_order: index + 1,
    }));

    setSortStatus(null);
    startTransition(async () => {
      setOrderedRows(nextRows);
      try {
        const result = await reorderMasterAction(kind, nextIds);
        if (result.ok) {
          setSortStatus({ tone: "success", message: result.message });
          return;
        }
        setSortStatus({ tone: "error", message: result.message });
      } catch {
        setSortStatus({ tone: "error", message: "เชื่อมต่อไม่สำเร็จ ระบบคืนตำแหน่งเดิมแล้ว" });
      }
    });
  }

  return (
    <section className="settings-grid">
      <div className="panel">
        <h2>เพิ่มรายการใหม่</h2>
        <form action={saveMasterAction.bind(null, kind)} className="stack gap-4">
          <label className="field">
            <span>ชื่อ</span>
            <input name="name" required />
          </label>
          <p className="field-hint">รายการใหม่จะต่อท้ายโดยอัตโนมัติ แล้วลากจัดลำดับได้ภายหลัง</p>
          <label className="check-row">
            <input name="is_active" type="checkbox" defaultChecked />
            <span>เปิดใช้งาน</span>
          </label>
          <button className="btn primary" type="submit">เพิ่มรายการ</button>
        </form>
      </div>

      <div className="panel">
        <div className="section-head master-section-head">
          <div>
            <h2>{title}</h2>
            <p className="muted">{description}</p>
          </div>
          <div aria-live="polite" className={`sort-save-status${sortStatus ? ` ${sortStatus.tone}` : ""}`}>
            {isPending ? (
              <><LoaderCircle aria-hidden="true" className="spin" size={16} /> กำลังบันทึกลำดับ…</>
            ) : sortStatus?.tone === "success" ? (
              <><Check aria-hidden="true" size={16} /> {sortStatus.message}</>
            ) : sortStatus?.tone === "error" ? (
              <><TriangleAlert aria-hidden="true" size={16} /> {sortStatus.message}</>
            ) : (
              <span className="muted">จับไอคอนด้านซ้ายเพื่อลากเรียงลำดับ</span>
            )}
          </div>
        </div>
        <DndContext
          collisionDetection={closestCenter}
          id={`master-order-${kind}`}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={orderedRows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="master-list">
              {orderedRows.map((row, index) => (
                <SortableMasterRow
                  disabled={isPending}
                  key={row.id}
                  kind={kind}
                  position={index + 1}
                  row={row}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}
