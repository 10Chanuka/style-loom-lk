interface OrderItemInfo {
  productName: string;
  productCode: string;
  size: string;
  colour: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderMessagePayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItemInfo[];
  subtotal: number;
  customerNotes?: string;
  whatsappNumber?: string;
}

export function buildWhatsAppOrderUrl(payload: OrderMessagePayload): string {
  const whatsappNumber = payload.whatsappNumber || process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || "94714903231";
  
  let itemsText = "";
  payload.items.forEach((item, index) => {
    itemsText += `${index + 1}. ${item.productName}\nProduct Code: ${item.productCode}\nSize: ${item.size}\nColour: ${item.colour}\nQuantity: ${item.quantity}\nUnit Price: LKR ${item.unitPrice.toFixed(2)}\nLine Total: LKR ${item.lineTotal.toFixed(2)}\n\n`;
  });

  const rawMessage = `Hello, I would like to place an order.

Order Number: ${payload.orderNumber}
Customer: ${payload.customerName}
Email: ${payload.customerEmail}
Phone: ${payload.customerPhone}
Delivery Address: ${payload.deliveryAddress}

Items:
${itemsText.trim()}

Order Total: LKR ${payload.subtotal.toFixed(2)}
Customer Notes: ${payload.customerNotes ? payload.customerNotes : "None"}

Please confirm availability and delivery details.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;
}

interface CustomizationMessagePayload {
  requestNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productType: string;
  quantity: number;
  selectedSize?: string;
  preferredColour?: string;
  preferredFabric?: string;
  designPlacement?: string;
  designDescription: string;
  referenceImageUrl?: string;
  requiredDate?: string;
  estimatedBudget?: number;
  notes?: string;
  whatsappNumber?: string;
}

export function buildWhatsAppCustomizationUrl(payload: CustomizationMessagePayload): string {
  const whatsappNumber = payload.whatsappNumber || process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || "94714903231";

  const rawMessage = `Hello, I would like to submit a Custom Clothing Request.

Request Number: ${payload.requestNumber}
Customer: ${payload.customerName}
Email: ${payload.customerEmail}
Phone: ${payload.customerPhone}

Product Type: ${payload.productType}
Quantity: ${payload.quantity}
Size: ${payload.selectedSize || "Standard / Custom"}
Preferred Colour: ${payload.preferredColour || "As discussed"}
Preferred Fabric: ${payload.preferredFabric || "As recommended"}
Design Placement / Style: ${payload.designPlacement || "Standard"}
Design Details: ${payload.designDescription}
Reference Image: ${payload.referenceImageUrl || "None attached"}
Required Date: ${payload.requiredDate || "Flexible"}
Estimated Budget: ${payload.estimatedBudget ? `LKR ${payload.estimatedBudget.toFixed(2)}` : "Not specified"}
Notes: ${payload.notes || "None"}

Please review my request and provide a quote/confirmation.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;
}
