import type { Booking, Equipment, Listing, Order, User } from "../types";

interface OrderInvoiceParams {
  kind: "order";
  order: Order;
  listing?: Listing;
  buyer?: User;
  seller?: User;
}

interface BookingInvoiceParams {
  kind: "booking";
  booking: Booking;
  equipment?: Equipment;
  renter?: User;
  owner?: User;
}

type InvoiceParams = OrderInvoiceParams | BookingInvoiceParams;

/**
 * Generate and trigger download of a PDF invoice for an order or equipment booking.
 * jsPDF is dynamically imported to keep the initial bundle small and to make this
 * file safe to import without forcing the dependency upfront.
 */
export async function downloadInvoice(params: InvoiceParams) {
  // Dynamic import — only loaded when the user clicks the download button
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const PAGE_W = 210;
  const MARGIN = 15;
  let y = MARGIN;

  // ── Header bar ────────────────────────────────────────────────────────────
  doc.setFillColor(22, 163, 74); // brand-600
  doc.rect(0, 0, PAGE_W, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AgriConnect", MARGIN, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Direct from farm. Built for small landholders.", MARGIN, 21);

  doc.setFontSize(9);
  doc.text("agriconnect.local", PAGE_W - MARGIN, 14, { align: "right" });
  doc.text("support@agriconnect.local", PAGE_W - MARGIN, 19, { align: "right" });

  doc.setTextColor(17, 24, 39);
  y = 38;

  // ── Title ─────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Tax Invoice / Receipt", MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);

  const id = params.kind === "order" ? params.order.id : params.booking.id;
  const created = params.kind === "order" ? params.order.createdAt : params.booking.createdAt;

  doc.text(`Invoice #: ${id}`, MARGIN, y);
  doc.text(
    `Date: ${new Date(created).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })}`,
    PAGE_W - MARGIN,
    y,
    { align: "right" }
  );

  doc.setTextColor(17, 24, 39);
  y += 10;

  // ── Parties ───────────────────────────────────────────────────────────────
  const partyA = params.kind === "order" ? params.buyer : params.renter;
  const partyB = params.kind === "order" ? params.seller : params.owner;
  const partyALabel = params.kind === "order" ? "Buyer (Bill to)" : "Renter (Bill to)";
  const partyBLabel = params.kind === "order" ? "Seller" : "Equipment Owner";

  const partyW = (PAGE_W - 2 * MARGIN - 10) / 2;

  // Left party box
  doc.setDrawColor(229, 231, 235);
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(MARGIN, y, partyW, 28, 2, 2, "FD");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(partyALabel.toUpperCase(), MARGIN + 3, y + 5);
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(partyA?.name ?? "—", MARGIN + 3, y + 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(partyA?.email ?? "", MARGIN + 3, y + 16);
  doc.text(partyA?.phone ?? "", MARGIN + 3, y + 21);
  doc.text(partyA?.location ?? "", MARGIN + 3, y + 26);

  // Right party box
  const rightX = MARGIN + partyW + 10;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(rightX, y, partyW, 28, 2, 2, "FD");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(partyBLabel.toUpperCase(), rightX + 3, y + 5);
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(partyB?.name ?? "—", rightX + 3, y + 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(partyB?.email ?? "", rightX + 3, y + 16);
  doc.text(partyB?.phone ?? "", rightX + 3, y + 21);
  doc.text(partyB?.location ?? "", rightX + 3, y + 26);

  y += 34;

  // ── Line items table ──────────────────────────────────────────────────────
  doc.setFillColor(22, 163, 74);
  doc.setTextColor(255, 255, 255);
  doc.rect(MARGIN, y, PAGE_W - 2 * MARGIN, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description", MARGIN + 3, y + 6);
  doc.text("Qty / Days", PAGE_W - MARGIN - 60, y + 6);
  doc.text("Rate", PAGE_W - MARGIN - 35, y + 6);
  doc.text("Amount", PAGE_W - MARGIN - 3, y + 6, { align: "right" });
  y += 9;

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");

  let total = 0;
  if (params.kind === "order") {
    const { order, listing } = params;
    total = order.totalAmount;
    const desc = listing?.title ?? "Listing";
    const cropType = listing?.cropType ?? "";
    const rate = listing ? listing.pricePerKg : Math.round(order.totalAmount / order.quantityKg);
    doc.setFontSize(10);
    doc.text(desc, MARGIN + 3, y + 6);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    if (cropType) doc.text(cropType, MARGIN + 3, y + 10.5);
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(10);
    doc.text(`${order.quantityKg} kg`, PAGE_W - MARGIN - 60, y + 6);
    doc.text(`Rs. ${rate.toLocaleString("en-IN")}/kg`, PAGE_W - MARGIN - 35, y + 6);
    doc.text(`Rs. ${order.totalAmount.toLocaleString("en-IN")}`, PAGE_W - MARGIN - 3, y + 6, {
      align: "right",
    });
    y += 14;
  } else {
    const { booking, equipment } = params;
    total = booking.totalAmount;
    const days = Math.max(
      1,
      Math.ceil(
        (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
    const rate = equipment ? equipment.pricePerDay : Math.round(booking.totalAmount / days);
    const desc = equipment?.name ?? "Equipment";
    doc.setFontSize(10);
    doc.text(desc, MARGIN + 3, y + 6);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      `${equipment?.category ?? "Rental"} · ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(
        booking.endDate
      ).toLocaleDateString()}`,
      MARGIN + 3,
      y + 10.5
    );
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(10);
    doc.text(`${days} day${days > 1 ? "s" : ""}`, PAGE_W - MARGIN - 60, y + 6);
    doc.text(`Rs. ${rate.toLocaleString("en-IN")}/day`, PAGE_W - MARGIN - 35, y + 6);
    doc.text(`Rs. ${booking.totalAmount.toLocaleString("en-IN")}`, PAGE_W - MARGIN - 3, y + 6, {
      align: "right",
    });
    y += 14;
  }

  // separator
  doc.setDrawColor(229, 231, 235);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalsX = PAGE_W - MARGIN - 60;
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text("Subtotal", totalsX, y);
  doc.setTextColor(17, 24, 39);
  doc.text(`Rs. ${total.toLocaleString("en-IN")}`, PAGE_W - MARGIN - 3, y, { align: "right" });
  y += 6;
  doc.setTextColor(107, 114, 128);
  doc.text("Platform fee", totalsX, y);
  doc.setTextColor(17, 24, 39);
  doc.text("Rs. 0", PAGE_W - MARGIN - 3, y, { align: "right" });
  y += 6;
  doc.setTextColor(107, 114, 128);
  doc.text("GST", totalsX, y);
  doc.setTextColor(17, 24, 39);
  doc.text("Included", PAGE_W - MARGIN - 3, y, { align: "right" });
  y += 7;

  // Total bar
  doc.setFillColor(22, 163, 74);
  doc.rect(totalsX - 3, y - 1, PAGE_W - MARGIN - (totalsX - 3), 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Total Paid", totalsX, y + 5.5);
  doc.text(`Rs. ${total.toLocaleString("en-IN")}`, PAGE_W - MARGIN - 3, y + 5.5, {
    align: "right",
  });
  y += 16;

  // ── Status / footer ───────────────────────────────────────────────────────
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const status = params.kind === "order" ? params.order.status : params.booking.status;
  doc.text(`Status: `, MARGIN, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 163, 74);
  doc.text(status.toUpperCase(), MARGIN + 17, y);

  y += 12;
  doc.setDrawColor(229, 231, 235);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    "This invoice is generated electronically and is valid without a signature.",
    PAGE_W / 2,
    y,
    { align: "center" }
  );
  y += 4;
  doc.text(
    "AgriConnect — empowering small landholders. Student project prototype.",
    PAGE_W / 2,
    y,
    { align: "center" }
  );

  const filename =
    params.kind === "order"
      ? `AgriConnect-Order-${id.replace(/[^a-z0-9-]/gi, "")}.pdf`
      : `AgriConnect-Booking-${id.replace(/[^a-z0-9-]/gi, "")}.pdf`;
  doc.save(filename);
}
