"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";  // Shadcn Button
import { Input } from "@/components/ui/input";    // Shadcn Input
import { Eye, EyeOff } from "lucide-react"; // Lucide React iconları
import { createUser } from "../_actions/login";
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils";

// Formik için Yup doğrulama şeması oluşturma
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Geçerli bir email adresi girin")
    .required("Email zorunludur"),
  password: Yup.string()
    .required("Şifre zorunludur"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
    .required("Şifre doğrulaması zorunludur"),
  firstName: Yup.string()
    .required("Ad zorunludur"),
  lastName: Yup.string()
    .required("Soyad zorunludur"),
});

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast()


  // Formik Hook'u kullanarak formu yönetme
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: isRegistering ? validationSchema : Yup.object({
      email: Yup.string().email("Geçerli bir email adresi girin").required("Email zorunludur"),
      password: Yup.string().required("Şifre zorunludur") // Giriş yap için password doğrulaması
    }),
    onSubmit: async (values) => {
      if (isRegistering) {
        try {
          const result = await createUser(values);
          setIsRegistering(false)
          toast({
            className: cn(
              'top-10 right-0 flex fixed md:max-w-[300px] md:h-[40px] md:top-4 md:right-4'
            ),
            variant: "success",
            title: "Hesabınız oluşturulmuştur.",
          })
        } catch (error) {
          toast({
            className: cn(
              'top-0 right-0 flex fixed md:max-w-[320px] md:max-h-[80px] md:top-4 md:right-4'
            ),
            variant: "destructive",
            title: error.message,
          })
        }
      } else {
        // Giriş yap işlemi
        const result = await signIn("credentials", {
          redirect: true,
          email: values.email,
          password: values.password,
          callbackUrl: "/",
        });

        if (result.error) {
          formik.setErrors({ password: "Geçersiz giriş" });
        }
      }
    },
  });

  // Şifre Görünürlüğü Toggle Fonksiyonu
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-6">Hesabım</h1>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex mb-6">
          <button
            className={`w-1/2 p-2  rounded-l-lg text-white font-bold ${!isRegistering ? 'bg-red-600' : 'bg-black'}`}
            onClick={() => setIsRegistering(false)}
          >
            Giriş Yap
          </button>
          <button
            className={`w-1/2 p-2 rounded-r-lg text-white font-bold ${isRegistering ? 'bg-red-600' : 'bg-black'}`}
            onClick={() => setIsRegistering(true)}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
              required
            />
         
          </div>
          {!isRegistering && (
            <div className="mb-4 relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Şifre"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
             
            </div>
          )}
          {isRegistering && (
            <>
              <div className="mb-4 flex space-x-4">
                <div className="w-1/2">
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Ad"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''}
                    required
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Soyad"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}
                    required
                  />
               
                </div>
              </div>
              <div className="mb-4 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Şifre"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
             
              </div>
              <div className="mb-4 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Şifre Tekrarı"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              
              </div>
            </>
          )}
          <Button type="submit" variant={"destructive"} className="w-full">
            {isRegistering ? "Kayıt Ol" : "Giriş Yap"}
          </Button>
        </form>
      </div>
    </div>
  );
}
