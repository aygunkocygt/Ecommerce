"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Adjust the path according to your setup
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button } from "@/components/ui/button";

const validationSchema = Yup.object({
    firstName: Yup.string().required('Ad gerekli'),
    lastName: Yup.string().required('Soyad gerekli'),
    companyName: Yup.string(),
    taxOrIdNumber: Yup.string().required('Vergi/TC Kimlik Numarası gerekli'),
    billingAddress: Yup.string().required('Fatura Adresi gerekli'),
    apartment: Yup.string(),
    city: Yup.string().required('Şehir gerekli'),
    district: Yup.string().required('İlçe gerekli'),
    shippingAddress: Yup.string().required('Teslimat Adresi gerekli'),
    phone: Yup.string().required('Telefon gerekli'),
    email: Yup.string().email('Geçersiz e-posta').required('E-posta gerekli'),
    termsAccepted: Yup.bool().oneOf([true], 'Kişisel verilerinizi kabul etmelisiniz').required('Şartları kabul etmelisiniz'),
});

function BillingInfoForm({ formData, onChange, isEditable, onSave }: { formData: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; isEditable: boolean; onSave: (data: any) => void }) {
    const formik = useFormik({
      initialValues: formData,
      validationSchema: validationSchema,
      onSubmit: (values) => {
        console.log("values:", values);
        onSave(values);
      },
    });

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      formik.handleBlur(e);
      formik.validateForm();
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Fatura Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className={`grid grid-cols-2 gap-4`}>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="firstName">
                  Ad
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={handleBlur}
                  className={`border text-xs ${formik.errors.firstName && formik.touched.firstName ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                  disabled={isEditable}
                />
                {formik.errors.firstName && formik.touched.firstName && <div className="text-xs text-red-600">{formik.errors.firstName}</div>}
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="lastName">
                  Soyad
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={handleBlur}
                  className={`border text-xs ${formik.errors.lastName && formik.touched.lastName ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                  disabled={isEditable}
                />
                {formik.errors.lastName && formik.touched.lastName && <div className="text-xs text-red-600">{formik.errors.lastName}</div>}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="companyName">
                Şirket Adı
              </label>
              <Input
                id="companyName"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.companyName && formik.touched.companyName ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.companyName && formik.touched.companyName && <div className="text-xs text-red-600">{formik.errors.companyName}</div>}
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="taxOrIdNumber">
                Vergi/TC Kimlik Numarası
              </label>
              <Input
                id="taxOrIdNumber"
                name="taxOrIdNumber"
                value={formik.values.taxOrIdNumber}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.taxOrIdNumber && formik.touched.taxOrIdNumber ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.taxOrIdNumber && formik.touched.taxOrIdNumber && <div className="text-xs text-red-600">{formik.errors.taxOrIdNumber}</div>}
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="billingAddress">
                Fatura Adresi
              </label>
              <Input
                id="billingAddress"
                name="billingAddress"
                value={formik.values.billingAddress}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.billingAddress && formik.touched.billingAddress ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.billingAddress && formik.touched.billingAddress && <div className="text-xs text-red-600">{formik.errors.billingAddress}</div>}
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="apartment">
                Daire/Site Adı
              </label>
              <Input
                id="apartment"
                name="apartment"
                value={formik.values.apartment}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.apartment && formik.touched.apartment ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.apartment && formik.touched.apartment && <div className="text-xs text-red-600">{formik.errors.apartment}</div>}
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="city">
                Şehir
              </label>
              <Input
                id="city"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.city && formik.touched.city ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.city && formik.touched.city && <div className="text-xs text-red-600">{formik.errors.city}</div>}
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="district">
                İlçe
              </label>
              <Input
                id="district"
                name="district"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.district && formik.touched.district ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.district && formik.touched.district && <div className="text-xs text-red-600">{formik.errors.district}</div>}
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="shippingAddress">
                Teslimat Adresi
              </label>
              <Input
                id="shippingAddress"
                name="shippingAddress"
                value={formik.values.shippingAddress}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.shippingAddress && formik.touched.shippingAddress ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.shippingAddress && formik.touched.shippingAddress && <div className="text-xs text-red-600">{formik.errors.shippingAddress}</div>}
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="phone">
                Telefon
              </label>
              <Input
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.phone && formik.touched.phone ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.phone && formik.touched.phone && <div className="text-xs text-red-600">{formik.errors.phone}</div>}
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="email">
                E-posta
              </label>
              <Input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`border text-xs ${formik.errors.email && formik.touched.email ? 'border-red-600' : ''} ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              {formik.errors.email && formik.touched.email && <div className="text-xs text-red-600">{formik.errors.email}</div>}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formik.values.termsAccepted}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                className={`form-checkbox ${isEditable ? 'bg-gray-100' : ''}`}
                disabled={isEditable}
              />
              <span className="text-xs">
                Kişisel verileriniz siparişinizi işleme almak, bu web sitesindeki deneyimlerinizi desteklemek ve gizlilik ilkesi sayfamızda açıklanan diğer amaçlar için kullanılacaktır.
              </span>
              {formik.errors.termsAccepted && formik.touched.termsAccepted && <div className="text-xs text-red-600">{formik.errors.termsAccepted}</div>}
            </div>
            <div className="flex justify-end">
              <Button size="sm" type="submit" variant={"outline"} className="py-2 px-4 rounded">
                {isEditable ? "Düzenle" : "Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
}

export default BillingInfoForm;
