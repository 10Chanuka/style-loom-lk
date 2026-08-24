"use client";

import React, { useState } from "react";
import { store } from "@/lib/supabase/store";
import { Profile } from "@/lib/supabase/mock-data";
import { useToast } from "@/components/ui/toast";
import { AuthModal } from "@/components/layout/AuthModal";
import { generateCustomizationNumber } from "@/lib/utils";
import { buildWhatsAppCustomizationUrl } from "@/lib/whatsapp";
import {
  Scissors,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  X,
  FileImage,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function CustomizePage() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    setCurrentUser(store.getCurrentUser());
  }, []);

  // Form State
  const [productType, setProductType] = useState<"Printed T-Shirt" | "Kurta" | "Blouse">("Printed T-Shirt");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Standard M");
  const [preferredColour, setPreferredColour] = useState("Black");
  const [preferredFabric, setPreferredFabric] = useState("100% Combed Cotton");
  const [printOrDesignType, setPrintOrDesignType] = useState("Screen Print");
  const [designPlacement, setDesignPlacement] = useState("Front Print");
  const [designDescription, setDesignDescription] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  
  // Custom measurements for Kurtas / Blouses
  const [neckStyle, setNeckStyle] = useState("Mandarin Collar");
  const [sleeveStyle, setSleeveStyle] = useState("3/4 Sleeves");
  const [chestMeasurement, setChestMeasurement] = useState("");
  const [waistMeasurement, setWaistMeasurement] = useState("");

  // Reference Image Upload State
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Contact Details
  const [customerName, setCustomerName] = useState(currentUser?.full_name || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "+94771234567");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [createdWhatsAppUrl, setCreatedWhatsAppUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Please upload a JPG, PNG, or WebP image", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image file size must be less than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setReferenceImageUrl(dataUrl);
      showToast("Reference image uploaded successfully", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setReferenceImageUrl(null);
  };

  const handleSubmitCustomization = async () => {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    if (!customerName || !customerEmail || !customerPhone) {
      showToast("Please fill in your contact details", "error");
      setStep(4);
      return;
    }
    if (!designDescription || designDescription.length < 10) {
      showToast("Please provide a description of your requested design (at least 10 characters)", "error");
      setStep(2);
      return;
    }

    setSubmitting(true);
    try {
      const reqNum = generateCustomizationNumber();
      const measurementsObj: Record<string, string> = {};
      if (productType !== "Printed T-Shirt") {
        measurementsObj.neckStyle = neckStyle;
        measurementsObj.sleeveStyle = sleeveStyle;
        if (chestMeasurement) measurementsObj.chest = chestMeasurement;
        if (waistMeasurement) measurementsObj.waist = waistMeasurement;
      }

      store.createCustomization({
        request_number: reqNum,
        user_id: currentUser.id,
        product_type: productType,
        quantity,
        preferred_colour: preferredColour,
        preferred_fabric: preferredFabric,
        selected_size: selectedSize,
        measurements: measurementsObj,
        print_or_design_type: printOrDesignType,
        design_placement: designPlacement,
        design_description: designDescription,
        reference_image_url: referenceImageUrl || undefined,
        required_date: requiredDate || undefined,
        estimated_budget: estimatedBudget ? parseFloat(estimatedBudget) : undefined,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        notes: notes || undefined,
        status: "whatsapp_pending",
        whatsapp_opened_at: new Date().toISOString(),
      });

      const placementCombined =
        productType === "Printed T-Shirt"
          ? designPlacement
          : `${neckStyle}, ${sleeveStyle}`;

      const waUrl = buildWhatsAppCustomizationUrl({
        requestNumber: reqNum,
        customerName,
        customerEmail,
        customerPhone,
        productType,
        quantity,
        selectedSize,
        preferredColour,
        preferredFabric,
        designPlacement: placementCombined,
        designDescription,
        referenceImageUrl: referenceImageUrl ? "(Uploaded Image Attached)" : undefined,
        requiredDate,
        estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : undefined,
        notes,
      });

      setCreatedWhatsAppUrl(waUrl);

      const opened = window.open(waUrl, "_blank");
      if (!opened) {
        showToast("Customization saved! Popup was blocked. Click the button to open WhatsApp.", "info");
      } else {
        showToast("Customization request created! Opening WhatsApp...", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to submit customization request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-rose-100 text-brand px-3 py-1 rounded-full text-xs font-bold dark:bg-slate-800">
          <Scissors className="h-4 w-4" /> Tailored & Printed Apparel
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Custom Clothing Request
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Specify your custom requirements step-by-step and send directly to our design team via WhatsApp.
        </p>
      </div>

      {/* Step Stepper */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 text-xs font-bold">
        {[
          { num: 1, label: "1. Type" },
          { num: 2, label: "2. Specs" },
          { num: 3, label: "3. Image" },
          { num: 4, label: "4. Contact" },
          { num: 5, label: "5. Review" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num as any)}
            className={`flex items-center gap-1 transition-colors ${
              step === s.num
                ? "text-brand border-b-2 border-brand pb-1 font-extrabold"
                : step > s.num
                ? "text-emerald-600"
                : "text-slate-400"
            }`}
          >
            {step > s.num && <CheckCircle2 className="h-3.5 w-3.5" />}
            {s.label}
          </button>
        ))}
      </div>

      {/* Success View */}
      {createdWhatsAppUrl ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center space-y-6 dark:bg-slate-900 dark:border-slate-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">
              Customization Request Saved!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your custom request is logged in our database. Complete your submission by opening the WhatsApp conversation.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <a
              href={createdWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-colors text-sm"
            >
              <MessageCircle className="h-5 w-5" /> Open WhatsApp Conversation
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6">
          
          {/* STEP 1: Product Type */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 1: Select Product Type
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    type: "Printed T-Shirt",
                    desc: "Unisex cotton T-shirts with front/back/chest screen print or DTG graphics.",
                    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
                  },
                  {
                    type: "Kurta",
                    desc: "Women Kurtas tailored with custom necklines, sleeve styles, and embroidery.",
                    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
                  },
                  {
                    type: "Blouse",
                    desc: "Women saree and modern Blouses tailored to your exact bust and waist measurements.",
                    img: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop&q=80",
                  },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setProductType(item.type as any)}
                    className={`p-4 rounded-xl border-2 text-left transition-all space-y-3 flex flex-col justify-between ${
                      productType === item.type
                        ? "border-brand bg-rose-50/40 dark:bg-slate-800"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                      <img src={item.img} alt={item.type} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.type}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)}>
                  Next Step: Specifications <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Specifications */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 2: Specifications & Design Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Size / Fit
                  </label>
                  <Select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="text-xs"
                  >
                    <option value="Small (S / 34)">Small (S / 34)</option>
                    <option value="Medium (M / 36)">Medium (M / 36)</option>
                    <option value="Large (L / 38)">Large (L / 38)</option>
                    <option value="XL (XL / 40)">XL (XL / 40)</option>
                    <option value="Custom Size Measurements">Custom Size Measurements</option>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Preferred Colour
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Emerald Green, Crimson Red, Black"
                    value={preferredColour}
                    onChange={(e) => setPreferredColour(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Preferred Fabric / Material
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 100% Combed Cotton, Pure Linen, Silk Blend"
                    value={preferredFabric}
                    onChange={(e) => setPreferredFabric(e.target.value)}
                    className="text-xs"
                  />
                </div>

                {/* Specific Placement options for T-Shirts vs Kurtas/Blouses */}
                {productType === "Printed T-Shirt" ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        Print Placement Options
                      </label>
                      <Select
                        value={designPlacement}
                        onChange={(e) => setDesignPlacement(e.target.value)}
                        className="text-xs"
                      >
                        <option value="Front Print">Front Print</option>
                        <option value="Back Print">Back Print</option>
                        <option value="Left Chest">Left Chest</option>
                        <option value="Right Chest">Right Chest</option>
                        <option value="Sleeve Print">Sleeve Print</option>
                        <option value="Full Front & Back">Full Front & Back</option>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        Print Technique
                      </label>
                      <Select
                        value={printOrDesignType}
                        onChange={(e) => setPrintOrDesignType(e.target.value)}
                        className="text-xs"
                      >
                        <option value="Screen Printing">Screen Printing</option>
                        <option value="DTG Digital Print">DTG Digital Print</option>
                        <option value="Vinyl / Foil Print">Vinyl / Foil Print</option>
                        <option value="Embroidery Motif">Embroidery Motif</option>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        Neck Design / Collar Style
                      </label>
                      <Select
                        value={neckStyle}
                        onChange={(e) => setNeckStyle(e.target.value)}
                        className="text-xs"
                      >
                        <option value="Mandarin Collar">Mandarin Collar</option>
                        <option value="Sweetheart Neck">Sweetheart Neck</option>
                        <option value="V-Neck with Piping">V-Neck with Piping</option>
                        <option value="High Neck Buttoned">High Neck Buttoned</option>
                        <option value="Round Neck">Round Neck</option>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        Sleeve Style
                      </label>
                      <Select
                        value={sleeveStyle}
                        onChange={(e) => setSleeveStyle(e.target.value)}
                        className="text-xs"
                      >
                        <option value="3/4 Sleeves">3/4 Sleeves</option>
                        <option value="Elbow Length">Elbow Length</option>
                        <option value="Puff Sleeves">Puff Sleeves</option>
                        <option value="Sleeveless">Sleeveless</option>
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Required Completion Date (Optional)
                  </label>
                  <Input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Estimated Budget (LKR)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 4500"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Design Description & Details *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your design artwork, text, placement ideas, or custom fit requirements in detail..."
                  value={designDescription}
                  onChange={(e) => setDesignDescription(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-3 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next Step: Reference Image <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Reference Image Upload */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 3: Upload Reference Image (Optional)
              </h3>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-4 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative max-w-xs mx-auto aspect-square rounded-xl overflow-hidden shadow-md">
                      <img src={imagePreview} alt="Reference" className="h-full w-full object-cover" />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full shadow hover:bg-rose-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Reference image attached
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-full bg-rose-100 text-brand flex items-center justify-center mx-auto dark:bg-slate-700">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-brand text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow">
                        <FileImage className="h-4 w-4" /> Choose JPG / PNG / WebP
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-400 mt-2">Maximum file size: 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(4)}>
                  Next Step: Contact Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Contact Details */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 4: Contact Details & Notes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    WhatsApp Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="text-xs"
                    placeholder="+94 71 490 3231"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Additional Delivery Notes (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Delivery location preference or special dates"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(5)}>
                  Next Step: Review & Submit <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 5: Review & Submit Custom Request
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-slate-500">Product Type:</span> <strong className="text-slate-900 dark:text-white">{productType}</strong></div>
                  <div><span className="text-slate-500">Quantity:</span> <strong className="text-slate-900 dark:text-white">{quantity}</strong></div>
                  <div><span className="text-slate-500">Size/Fit:</span> <strong className="text-slate-900 dark:text-white">{selectedSize}</strong></div>
                  <div><span className="text-slate-500">Colour:</span> <strong className="text-slate-900 dark:text-white">{preferredColour}</strong></div>
                  <div><span className="text-slate-500">Fabric:</span> <strong className="text-slate-900 dark:text-white">{preferredFabric}</strong></div>
                  <div><span className="text-slate-500">Budget:</span> <strong className="text-slate-900 dark:text-white">{estimatedBudget ? `LKR ${estimatedBudget}` : "Not specified"}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block mb-1">Design Details:</span>
                  <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line font-mono text-[11px]">
                    {designDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block mb-1">Customer Info:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {customerName} ({customerPhone}) • {customerEmail}
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(4)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <Button
                  onClick={handleSubmitCustomization}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
                >
                  {submitting ? (
                    "Saving Request..."
                  ) : (
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" /> Submit & Open WhatsApp
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

        </div>
      )}

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => showToast("Authenticated!", "success")}
      />
    </div>
  );
}
