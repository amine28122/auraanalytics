'use client';

import { useAuth, useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

type UserProfile = {
    language?: 'en' | 'ar' | 'es';
}

const translations = {
    en: {
        title: 'Privacy Policy',
        description: 'Last updated: July 27, 2024',
        content: [
            {
                title: '1. Introduction',
                body: 'AURA ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by our application. This policy applies to our application named AURA and its associated services. By using our Service, you agree to the collection and use of information in accordance with this policy.'
            },
            {
                title: '2. Information We Collect',
                body: `We collect several types of information for various purposes to provide and improve our Service to you.
- **Personal Identification Information:** When you register, we collect your Name, and Email Address.
- **Account Information:** We store your chosen Language Preference, subscription plan (Free, Premium, Aura Plan), and learning progress.
- **Usage Data:** We track your analysis usage (analysisCount, lastAnalysisDate) to enforce plan limits.
- **User-Provided Content:** We process chart images and camera captures that you provide for analysis. For payment activation, we collect the Transaction ID and a Screenshot of your payment receipt.`
            },
            {
                title: '3. How We Use Your Information',
                body: `We use the collected data for the following purposes:
- To provide and maintain our Service.
- To manage your account, including processing plan upgrades and activations.
- To personalize your experience by providing content in your preferred language.
- To monitor your usage to prevent abuse and enforce subscription limits.
- To improve our application and services.
- To communicate with you, including responding to customer service requests.`
            },
            {
                title: '4. Data Sharing and Third-Party Services',
                body: `Your privacy is important to us. We do not sell your personal data. However, we may share information with certain third-party service providers to operate our application:
- **Cloud & Database Providers:** For user authentication, data storage, and backend infrastructure.
- **Service Providers for Analysis:** The chart images you submit are sent to our partners to process them and generate trade signals. We do not send personal identification information with these images.
- **Embedded Content Providers:** For market data widgets and charts. Your interaction with this content may be subject to their respective privacy policies.
- **Customer Support Platforms:** To provide you with real-time support. Information you share in these communications is subject to their privacy policies.`
            },
            {
                title: '5. Data Security',
                body: "We implement a variety of security measures to maintain the safety of your personal information. All payment-related data you submit for activation is stored securely and is only accessible by authorized personnel for verification purposes. However, no method of transmission over the Internet or method of electronic storage is 100% secure."
            },
            {
                title: '6. Your Consent',
                body: 'By using our app, registering an account, and submitting content for analysis, you consent to our Privacy Policy.'
            },
            {
                title: '7. Changes to This Privacy Policy',
                body: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.'
            }
        ]
    },
    ar: {
        title: 'سياسة الخصوصية',
        description: 'آخر تحديث: 27 يوليو 2024',
        content: [
            {
                title: '1. مقدمة',
                body: 'تلتزم أورا ("نحن"، "لنا"، أو "خاصتنا") بحماية خصوصيتك. تشرح سياسة الخصوصية هذه كيفية جمع معلوماتك الشخصية واستخدامها والكشف عنها من قبل تطبيقنا. تنطبق هذه السياسة على تطبيقنا المسمى أورا والخدمات المرتبطة به. باستخدامك لخدمتنا، فإنك توافق على جمع واستخدام المعلومات وفقًا لهذه السياسة.'
            },
            {
                title: '2. المعلومات التي نجمعها',
                body: `نقوم بجمع عدة أنواع من المعلومات لأغراض مختلفة لتوفير وتحسين خدمتنا لك.
- **معلومات التعريف الشخصية:** عند التسجيل، نقوم بجمع اسمك وعنوان بريدك الإلكتروني.
- **معلومات الحساب:** نقوم بتخزين تفضيلات اللغة التي اخترتها، وخطة الاشتراك (مجانية، مميزة، خطة أورا)، وتقدمك التعليمي.
- **بيانات الاستخدام:** نتتبع استخدامك للتحليلات (عدد التحليلات، تاريخ آخر تحليل) لفرض حدود الخطة.
- **المحتوى المقدم من المستخدم:** نقوم بمعالجة صور الرسوم البيانية والصور الملتقطة بالكاميرا التي تقدمها للتحليل. لتفعيل الدفع، نقوم بجمع معرف المعاملة ولقطة شاشة لإيصال الدفع الخاص بك.`
            },
            {
                title: '3. كيف نستخدم معلوماتك',
                body: `نستخدم البيانات المجمعة للأغراض التالية:
- لتوفير وصيانة خدمتنا.
- لإدارة حسابك، بما في ذلك معالجة ترقيات وتفعيلات الخطط.
- لتخصيص تجربتك من خلال توفير المحتوى بلغتك المفضلة.
- لمراقبة استخدامك لمنع إساءة الاستخدام وفرض حدود الاشتراك.
- لتحسين تطبيقنا وخدماتنا.
- للتواصل معك، بما في ذلك الرد على طلبات خدمة العملاء.`
            },
            {
                title: '4. مشاركة البيانات وخدمات الطرف الثالث',
                body: `خصوصيتك تهمنا. نحن لا نبيع بياناتك الشخصية. ومع ذلك، قد نشارك المعلومات مع مزودي خدمات من جهات خارجية لتشغيل تطبيقنا:
- **مزودو الخدمات السحابية وقواعد البيانات:** لمصادقة المستخدم وتخزين البيانات والبنية التحتية الخلفية.
- **مزودو خدمات التحليل:** يتم إرسال صور الرسوم البيانية التي تقدمها إلى شركائنا لمعالجتها وإنشاء إشارات تداول. نحن لا نرسل معلومات تعريف شخصية مع هذه الصور.
- **مزودو المحتوى المضمن:** لعرض أدوات بيانات السوق والرسوم البيانية. قد يخضع تفاعلك مع هذا المحتوى لسياسات الخصوصية الخاصة بهم.
- **منصات دعم العملاء:** لتزويدك بالدعم في الوقت الفعلي. تخضع المعلومات التي تشاركها في هذه الاتصالات لسياسات الخصوصية الخاصة بهم.`
            },
            {
                title: '5. أمن البيانات',
                body: 'نقوم بتنفيذ مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتك الشخصية. يتم تخزين جميع البيانات المتعلقة بالدفع التي تقدمها للتفعيل بشكل آمن ولا يمكن الوصول إليها إلا من قبل الموظفين المصرح لهم لأغراض التحقق. ومع ذلك، لا توجد وسيلة نقل عبر الإنترنت أو طريقة تخزين إلكتروني آمنة بنسبة 100%.'
            },
            {
                title: '6. موافقتك',
                body: 'باستخدام تطبيقنا، والتسجيل للحصول على حساب، وتقديم محتوى للتحليل، فإنك توافق على سياسة الخصوصية الخاصة بنا.'
            },
            {
                title: '7. التغييرات على سياسة الخصوصية هذه',
                body: 'قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنقوم بإعلامك بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة. ننصحك بمراجعة سياسة الخصوصية هذه بشكل دوري لأي تغييرات.'
            }
        ]
    },
    es: {
        title: 'Política de Privacidad',
        description: 'Última actualización: 27 de julio de 2024',
        content: [
            {
                title: '1. Introducción',
                body: 'AURA ("nosotros", "nuestro") se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo se recopila, utiliza y divulga su información personal por nuestra aplicación. Esta política se aplica a nuestra aplicación llamada AURA y sus servicios asociados. Al utilizar nuestro Servicio, usted acepta la recopilación y el uso de información de acuerdo con esta política.'
            },
            {
                title: '2. Información que recopilamos',
                body: `Recopilamos varios tipos de información para diversos fines para proporcionar y mejorar nuestro Servicio para usted.
- **Información de Identificación Personal:** Cuando se registra, recopilamos su Nombre y Dirección de Correo Electrónico.
- **Información de la Cuenta:** Almacenamos su Preferencia de Idioma, plan de suscripción (Gratuito, Premium, Plan Aura) y su progreso de aprendizaje.
- **Datos de Uso:** Hacemos un seguimiento de su uso de análisis (analysisCount, lastAnalysisDate) para hacer cumplir los límites del plan.
- **Contenido Proporcionado por el Usuario:** Procesamos imágenes de gráficos y capturas de cámara que usted proporciona para su análisis. Para la activación del pago, recopilamos el ID de Transacción y una Captura de Pantalla de su recibo de pago.`
            },
            {
                title: '3. Cómo usamos su información',
                body: `Utilizamos los datos recopilados para los siguientes propósitos:
- Para proporcionar y mantener nuestro Servicio.
- Para gestionar su cuenta, incluido el procesamiento de actualizaciones y activaciones de planes.
- Para personalizar su experiencia proporcionando contenido en su idioma preferido.
- Para monitorear su uso para prevenir abusos y hacer cumplir los límites de suscripción.
- Para mejorar nuestra aplicación y nuestros servicios.
- Para comunicarnos con usted, incluida la respuesta a las solicitudes de servicio al cliente.`
            },
            {
                title: '4. Intercambio de Datos y Servicios de Terceros',
                body: `Su privacidad es importante para nosotros. No vendemos sus datos personales. Sin embargo, podemos compartir información con ciertos proveedores de servicios de terceros para operar nuestra aplicación:
- **Proveedores de Nube y Bases de Datos:** Para la autenticación de usuarios, almacenamiento de datos e infraestructura de backend.
- **Proveedores de Servicios para Análisis:** Las imágenes de gráficos que envía se envían a nuestros socios para procesarlas y generar señales de trading. No enviamos información de identificación personal con estas imágenes.
- **Proveedores de Contenido Incrustado:** Para widgets de datos de mercado y gráficos. Su interacción con este contenido puede estar sujeta a sus respectivas políticas de privacidad.
- **Plataformas de Soporte al Cliente:** Para brindarle soporte en tiempo real. La información que comparta en estas comunicaciones está sujeta a sus políticas de privacidad.`
            },
            {
                title: '5. Seguridad de los Datos',
                body: 'Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal. Todos los datos relacionados con el pago que envía para la activación se almacenan de forma segura y solo son accesibles por personal autorizado para fines de verificación. Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro.'
            },
            {
                title: '6. Su Consentimiento',
                body: 'Al utilizar nuestra aplicación, registrar una cuenta y enviar contenido para su análisis, usted acepta nuestra Política de Privacidad.'
            },
            {
                title: '7. Cambios a esta Política de Privacidad',
                body: 'Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página. Se le aconseja que revise esta Política de Privacidad periódicamente para cualquier cambio.'
            }
        ]
    }
};

export default function PrivacyPolicyPage() {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

     useEffect(() => {
        if (user && firestore) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setUserProfile(doc.data() as UserProfile);
                }
            });
            return () => unsubscribe();
        }
    }, [user, firestore]);
    
    const lang = userProfile?.language || 'en';
    const t = translations[lang] || translations.en;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <div className="flex flex-col gap-8" dir={dir}>
            <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <h1 className="font-headline text-3xl font-bold tracking-tighter">
                        {t.title}
                    </h1>
                </div>
                <p className="text-muted-foreground">
                    {t.description}
                </p>
            </div>
            
            <Card className="card-glow">
                <CardContent className="pt-6">
                    <div className="prose prose-sm dark:prose-invert max-w-full space-y-6 text-muted-foreground">
                       {t.content.map((section, index) => (
                           <div key={index}>
                               <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                               <p className="whitespace-pre-wrap">{section.body}</p>
                           </div>
                       ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
