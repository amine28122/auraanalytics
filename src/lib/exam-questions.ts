export const examQuestions = {
    en: {
        examTitle: "Final Knowledge Exam",
        pageDescription: "Answer all questions below and submit to see your score.",
        pageIndicator: (current: number, total: number) => `Page ${current} of ${total}`,
        nextButton: "Next Page",
        prevButton: "Previous Page",
        submitButton: "Submit Exam",
        resultsTitle: "Exam Results",
        scoreText: (score: number, total: number) => `You answered ${score} out of ${total} questions correctly.`,
        passMessage: "Congratulations! You have a solid understanding of the core concepts.",
        failMessage: "Good effort! We recommend reviewing the lessons again to strengthen your knowledge.",
        backToLearning: "Back to Learning Path",
        retryExam: "Retry Exam",
        certificateName: "Full Name for Certificate",
        certificateNamePlaceholder: "Enter your full name",
        downloadCertificate: "Download Certificate",
        passingScore: 70, // Percentage
        certificate: {
            awardedBy: "Certificate of Distinction Awarded by AURA ANALYTICS",
            completionText: "For demonstrating exceptional knowledge and successfully completing the AURA Academy learning curriculum. This certificate is awarded on merit, proving that you are an experienced and recognized trader.",
            gradePass: "SUCCESSFULLY COMPLETED",
            gradeMaster: "COMPLETED WITH DISTINCTION"
        },
        pages: [
            {
                title: "Part 1: Core Concepts",
                questions: [
                    {
                        question: "What is the term for the difference between the bid and ask price of a currency pair?",
                        options: ["Slippage", "Spread", "Margin"],
                        correctAnswer: 1
                    },
                    {
                        question: "A 'Hammer' candlestick pattern at the bottom of a downtrend is considered a...",
                        options: ["Bearish reversal signal", "Continuation signal", "Bullish reversal signal"],
                        correctAnswer: 2
                    },
                    {
                        question: "If you place an order to buy EUR/USD at a price *above* the current market price, what type of order is it?",
                        options: ["Buy Limit", "Buy Stop", "Market Order"],
                        correctAnswer: 1
                    },
                    {
                        question: "Which type of analysis focuses on economic data like interest rates and GDP?",
                        options: ["Technical Analysis", "Fundamental Analysis", "Sentimental Analysis"],
                        correctAnswer: 1
                    },
                    {
                        question: "A 'Bearish Engulfing' pattern is a dual candlestick pattern that signals a potential...",
                        options: ["Uptrend continuation", "Downtrend reversal", "Top and bearish reversal"],
                        correctAnswer: 2
                    },
                    {
                        question: "A long, flat line connecting multiple swing highs on a chart is known as a...",
                        options: ["Support Level", "Trend Line", "Resistance Level"],
                        correctAnswer: 2
                    },
                    {
                        question: "The 'Golden Cross' is a long-term bullish signal that occurs when...",
                        options: ["The 50 EMA crosses below the 200 EMA", "The RSI goes above 70", "The 50 EMA crosses above the 200 EMA"],
                        correctAnswer: 2
                    },
                    {
                        question: "What does an RSI value of 25 typically indicate?",
                        options: ["Overbought conditions", "Oversold conditions", "A strong trend"],
                        correctAnswer: 1
                    },
                    {
                        question: "If you risk $100 on a trade and your target profit is $300, what is your Risk-to-Reward ratio?",
                        options: ["1:2", "1:3", "3:1"],
                        correctAnswer: 1
                    },
                    {
                        question: "What is the primary purpose of a Stop-Loss order?",
                        options: ["To secure profits", "To limit potential losses", "To enter a trade at a better price"],
                        correctAnswer: 1
                    }
                ]
            },
            {
                title: "Part 2: Practical Application (Pattern Recognition)",
                questions: [
                    {
                        question: "Identify the pattern shown in the image below.",
                        image: "https://picsum.photos/seed/h_and_s/600/400",
                        aiHint: "Head and Shoulders chart pattern",
                        options: ["Double Top", "Head and Shoulders", "Ascending Triangle"],
                        correctAnswer: 1
                    },
                    {
                        question: "What does this candlestick pattern indicate?",
                        image: "https://picsum.photos/seed/bull_engulf/600/400",
                        aiHint: "Bullish Engulfing chart pattern",
                        options: ["A strong bearish reversal", "Continuation of a downtrend", "A strong bullish reversal"],
                        correctAnswer: 2
                    },
                    {
                        question: "This pattern is a classic continuation pattern. What is it called?",
                        image: "https://picsum.photos/seed/bull_flag/600/400",
                        aiHint: "Bull Flag chart pattern",
                        options: ["Bull Flag", "Falling Wedge", "Bearish Pennant"],
                        correctAnswer: 0
                    },
                     {
                        question: "Which pattern is forming on this chart?",
                        image: "https://picsum.photos/seed/double_bottom/600/400",
                        aiHint: "Double Bottom chart pattern",
                        options: ["Double Bottom", "Inverse Head and Shoulders", "Tweezer Top"],
                        correctAnswer: 0
                    },
                    {
                        question: "This pattern often precedes a bearish breakout. What is it?",
                        image: "https://picsum.photos/seed/desc_triangle/600/400",
                        aiHint: "Descending Triangle chart pattern",
                        options: ["Symmetrical Triangle", "Rising Wedge", "Descending Triangle"],
                        correctAnswer: 2
                    },
                    {
                        question: "Identify the pattern indicated by the arrow.",
                        image: "https://picsum.photos/seed/shooting_star/600/400",
                        aiHint: "Shooting Star candlestick",
                        options: ["Hammer", "Shooting Star", "Doji"],
                        correctAnswer: 1
                    },
                    {
                        question: "What is this triple candlestick reversal pattern called?",
                        image: "https://picsum.photos/seed/morning_star/600/400",
                        aiHint: "Morning Star chart pattern",
                        options: ["Evening Star", "Three White Soldiers", "Morning Star"],
                        correctAnswer: 2
                    },
                    {
                        question: "This pattern suggests a potential breakout to the upside. What is it?",
                        image: "https://picsum.photos/seed/asc_triangle/600/400",
                        aiHint: "Ascending Triangle chart pattern",
                        options: ["Ascending Triangle", "Bear Flag", "Falling Wedge"],
                        correctAnswer: 0
                    },
                     {
                        question: "This pattern signals strong bearish pressure. What is it?",
                        image: "https://picsum.photos/seed/three_crows/600/400",
                        aiHint: "Three Black Crows chart pattern",
                        options: ["Three Black Crows", "Tweezer Bottom", "Three White Soldiers"],
                        correctAnswer: 0
                    },
                    {
                        question: "What does this candlestick, appearing after a downtrend, signify?",
                        image: "https://picsum.photos/seed/hammer_candle/600/400",
                        aiHint: "Hammer candlestick chart",
                        options: ["Hanging Man", "Bearish Engulfing", "Hammer"],
                        correctAnswer: 2
                    }
                ]
            },
            {
                title: "Part 3: Advanced Concepts & Risk Management",
                questions: [
                    {
                        question: "What is the maximum percentage of your trading account you should risk on a single trade, according to the 1% rule?",
                        options: ["1%", "5%", "10%"],
                        correctAnswer: 0
                    },
                    {
                        question: "A 'Trailing Stop' order is used to...",
                        options: ["Enter a trade at a specific price", "Protect profits on a winning trade", "Double down on a losing position"],
                        correctAnswer: 1
                    },
                    {
                        question: "'Revenge trading' is a psychological pitfall where a trader...",
                        options: ["Tries to win back losses with larger, riskier trades", "Only trades with a high reward-to-risk ratio", "Sticks strictly to their trading plan"],
                        correctAnswer: 0
                    },
                    {
                        question: "What does 'confluence' mean in technical analysis?",
                        options: ["When two indicators give opposing signals", "When multiple, independent indicators or patterns suggest the same trading idea", "The overlap of two major trading sessions"],
                        correctAnswer: 1
                    },
                    {
                        question: "If your account size is $10,000 and you risk 2% per trade, what is the maximum dollar amount you should risk?",
                        options: ["$100", "$200", "$500"],
                        correctAnswer: 1
                    },
                    {
                        question: "What is a 'liquidity grab' or 'stop hunt' in ICT concepts?",
                        options: ["A sudden price spike designed to trigger stop-loss orders before moving in the intended direction", "A period of low trading volume", "A fundamental news announcement"],
                        correctAnswer: 0
                    },
                    {
                        question: "In Elliott Wave theory, which wave is typically the longest and strongest impulse wave?",
                        options: ["Wave 1", "Wave 3", "Wave 5"],
                        correctAnswer: 1
                    },
                    {
                        question: "What is the primary drawback of using very high leverage?",
                        options: ["It reduces potential profits", "It significantly increases the risk of a margin call and large losses", "It slows down trade execution"],
                        correctAnswer: 1
                    },
                    {
                        question: "A trading journal is primarily used for...",
                        options: ["Sharing signals with other traders", "Tracking and analyzing your own performance to find weaknesses", "Calculating tax obligations"],
                        correctAnswer: 1
                    },
                    {
                        question: "What does 'FOMO' (Fear Of Missing Out) often lead to in trading?",
                        options: ["Careful, planned entries", "Ignoring your trading plan to chase a fast-moving market", "Taking smaller, safer positions"],
                        correctAnswer: 1
                    }
                ]
            }
        ]
    },
    ar: {
        examTitle: "الاختبار المعرفي النهائي",
        pageDescription: "أجب على جميع الأسئلة أدناه وأرسلها لترى نتيجتك.",
        pageIndicator: (current: number, total: number) => `صفحة ${current} من ${total}`,
        nextButton: "الصفحة التالية",
        prevButton: "الصفحة السابقة",
        submitButton: "إرسال الاختبار",
        resultsTitle: "نتائج الاختبار",
        scoreText: (score: number, total: number) => `لقد أجبت على ${score} من ${total} أسئلة بشكل صحيح.`,
        passMessage: "تهانينا! لديك فهم قوي للمفاهيم الأساسية.",
        failMessage: "مجهود طيب! نوصي بمراجعة الدروس مرة أخرى لتقوية معرفتك.",
        backToLearning: "العودة إلى مسار التعلم",
        retryExam: "إعادة الاختبار",
        certificateName: "الاسم الكامل للشهادة",
        certificateNamePlaceholder: "أدخل اسمك الكامل",
        downloadCertificate: "تحميل الشهادة",
        passingScore: 70,
        certificate: {
            awardedBy: "شهادة تميز مقدمة من AURA ANALYTICS",
            completionText: "لإظهار معرفة استثنائية وإكمال منهج أكاديمية AURA التعليمي بنجاح. تُمنح هذه الشهادة عن جدارة، مما يثبت أنك متداول متمرس ومعترف به.",
            gradePass: "أكمل بنجاح",
            gradeMaster: "أكمل بامتياز"
        },
        pages: [
            {
                title: "الجزء 1: المفاهيم الأساسية",
                questions: [
                    {
                        question: "ما هو المصطلح الذي يطلق على الفرق بين سعر الشراء (Bid) وسعر البيع (Ask) لزوج من العملات؟",
                        options: ["الانزلاق السعري (Slippage)", "الفارق السعري (Spread)", "الهامش (Margin)"],
                        correctAnswer: 1
                    },
                    {
                        question: "نمط شمعة 'المطرقة' (Hammer) في قاع اتجاه هابط يعتبر...",
                        options: ["إشارة انعكاس هبوطية", "إشارة استمرارية", "إشارة انعكاس صعودية"],
                        correctAnswer: 2
                    },
                    {
                        question: "إذا وضعت أمرًا لشراء EUR/USD بسعر *أعلى* من سعر السوق الحالي، فما هو نوع هذا الأمر؟",
                        options: ["شراء محدد (Buy Limit)", "شراء موقوف (Buy Stop)", "أمر سوق (Market Order)"],
                        correctAnswer: 1
                    },
                    {
                        question: "أي نوع من التحليل يركز على البيانات الاقتصادية مثل أسعار الفائدة والناتج المحلي الإجمالي؟",
                        options: ["التحليل الفني", "التحليل الأساسي", "تحليل المعنويات"],
                        correctAnswer: 1
                    },
                    {
                        question: "نمط 'الابتلاع الهابط' (Bearish Engulfing) هو نمط شموع مزدوج يشير إلى احتمالية...",
                        options: ["استمرار الاتجاه الصاعد", "انعكاس الاتجاه الهابط", "قمة وانعكاس هبوطي"],
                        correctAnswer: 2
                    },
                    {
                        question: "الخط الأفقي الطويل الذي يربط بين عدة قمم متأرجحة على الرسم البياني يُعرف بـ...",
                        options: ["مستوى الدعم", "خط الاتجاه", "مستوى المقاومة"],
                        correctAnswer: 2
                    },
                    {
                        question: "يعتبر 'التقاطع الذهبي' إشارة صعودية طويلة الأجل تحدث عندما...",
                        options: ["يتقاطع متوسط الحركة الأسي 50 تحت متوسط الحركة الأسي 200", "يتجاوز مؤشر القوة النسبية 70", "يتقاطع متوسط الحركة الأسي 50 فوق متوسط الحركة الأسي 200"],
                        correctAnswer: 2
                    },
                    {
                        question: "ماذا تشير قيمة مؤشر القوة النسبية (RSI) البالغة 25 عادةً؟",
                        options: ["حالة تشبع شرائي", "حالة تشبع بيعي", "اتجاه قوي"],
                        correctAnswer: 1
                    },
                    {
                        question: "إذا خاطرت بمبلغ 100 دولار في صفقة وكان هدف ربحك 300 دولار، فما هي نسبة المخاطرة إلى العائد الخاصة بك؟",
                        options: ["1:2", "1:3", "3:1"],
                        correctAnswer: 1
                    },
                    {
                        question: "ما هو الغرض الأساسي من أمر وقف الخسارة (Stop-Loss)؟",
                        options: ["لتأمين الأرباح", "للحد من الخسائر المحتملة", "للدخول في صفقة بسعر أفضل"],
                        correctAnswer: 1
                    }
                ]
            },
            {
                title: "الجزء 2: التطبيق العملي (التعرف على الأنماط)",
                 questions: [
                    {
                        question: "حدد النمط الموضح في الصورة أدناه.",
                        image: "https://picsum.photos/seed/h_and_s/600/400",
                        aiHint: "Head and Shoulders chart pattern",
                        options: ["قمة مزدوجة", "رأس وكتفين", "مثلث صاعد"],
                        correctAnswer: 1
                    },
                    {
                        question: "ماذا يشير نمط الشموع هذا؟",
                        image: "https://picsum.photos/seed/bull_engulf/600/400",
                        aiHint: "Bullish Engulfing chart pattern",
                        options: ["انعكاس هبوطي قوي", "استمرار الاتجاه الهابط", "انعكاس صعودي قوي"],
                        correctAnswer: 2
                    },
                    {
                        question: "هذا النمط هو نمط استمراري كلاسيكي. ماذا يسمى؟",
                        image: "https://picsum.photos/seed/bull_flag/600/400",
                        aiHint: "Bull Flag chart pattern",
                        options: ["علم صاعد", "وتد هابط", "راية هابطة"],
                        correctAnswer: 0
                    },
                     {
                        question: "أي نمط يتشكل في هذا الرسم البياني؟",
                        image: "https://picsum.photos/seed/double_bottom/600/400",
                        aiHint: "Double Bottom chart pattern",
                        options: ["قاع مزدوج", "رأس وكتفين مقلوب", "قمة الملقط"],
                        correctAnswer: 0
                    },
                    {
                        question: "هذا النمط يسبق غالبًا اختراقًا هبوطيًا. ما هو؟",
                        image: "https://picsum.photos/seed/desc_triangle/600/400",
                        aiHint: "Descending Triangle chart pattern",
                        options: ["مثلث متماثل", "وتد صاعد", "مثلث هابط"],
                        correctAnswer: 2
                    },
                    {
                        question: "حدد النمط المشار إليه بالسهم.",
                        image: "https://picsum.photos/seed/shooting_star/600/400",
                        aiHint: "Shooting Star candlestick",
                        options: ["مطرقة", "نجم ساقط", "دوجي"],
                        correctAnswer: 1
                    },
                    {
                        question: "ماذا يطلق على نمط الانعكاس الثلاثي هذا؟",
                        image: "https://picsum.photos/seed/morning_star/600/400",
                        aiHint: "Morning Star chart pattern",
                        options: ["نجمة المساء", "ثلاثة جنود بيض", "نجمة الصباح"],
                        correctAnswer: 2
                    },
                    {
                        question: "هذا النمط يشير إلى اختراق محتمل للأعلى. ما هو؟",
                        image: "https://picsum.photos/seed/asc_triangle/600/400",
                        aiHint: "Ascending Triangle chart pattern",
                        options: ["مثلث صاعد", "علم هابط", "وتد هابط"],
                        correctAnswer: 0
                    },
                     {
                        question: "هذا النمط يشير إلى ضغط بيع قوي. ما هو؟",
                        image: "https://picsum.photos/seed/three_crows/600/400",
                        aiHint: "Three Black Crows chart pattern",
                        options: ["ثلاثة غربان سود", "قاع الملقط", "ثلاثة جنود بيض"],
                        correctAnswer: 0
                    },
                    {
                        question: "ماذا تعني هذه الشمعة التي تظهر بعد اتجاه هابط؟",
                        image: "https://picsum.photos/seed/hammer_candle/600/400",
                        aiHint: "Hammer candlestick chart",
                        options: ["رجل مشنوق", "ابتلاع هابط", "مطرقة"],
                        correctAnswer: 2
                    }
                ]
            },
            {
                title: "الجزء 3: المفاهيم المتقدمة وإدارة المخاطر",
                questions: [
                    {
                        question: "ما هي النسبة القصوى من حساب التداول التي يجب أن تخاطر بها في صفقة واحدة، وفقًا لقاعدة 1%؟",
                        options: ["1%", "5%", "10%"],
                        correctAnswer: 0
                    },
                    {
                        question: "يستخدم أمر 'وقف الخسارة المتحرك' (Trailing Stop) لـ...",
                        options: ["الدخول في صفقة بسعر محدد", "حماية الأرباح في صفقة رابحة", "مضاعفة حجم الصفقة الخاسرة"],
                        correctAnswer: 1
                    },
                    {
                        question: "'التداول الانتقامي' هو فخ نفسي حيث يقوم المتداول بـ...",
                        options: ["محاولة استعادة الخسائر بصفقات أكبر وأكثر خطورة", "التداول فقط بنسبة عائد إلى مخاطرة عالية", "الالتزام الصارم بخطة التداول الخاصة به"],
                        correctAnswer: 0
                    },
                    {
                        question: "ماذا يعني 'التوافق' (Confluence) في التحليل الفني؟",
                        options: ["عندما يعطي مؤشران إشارات متعارضة", "عندما تشير عدة مؤشرات أو أنماط مستقلة إلى نفس فكرة التداول", "تداخل جلستي تداول رئيسيتين"],
                        correctAnswer: 1
                    },
                    {
                        question: "إذا كان حجم حسابك 10,000 دولار وتخاطر بنسبة 2% لكل صفقة، فما هو أقصى مبلغ بالدولار يجب أن تخاطر به؟",
                        options: ["100 دولار", "200 دولار", "500 دولار"],
                        correctAnswer: 1
                    },
                    {
                        question: "ما هو 'الاستيلاء على السيولة' أو 'صيد الوقف' في مفاهيم ICT؟",
                        options: ["ارتفاع مفاجئ في السعر مصمم لتفعيل أوامر وقف الخسارة قبل التحرك في الاتجاه المقصود", "فترة انخفاض حجم التداول", "إعلان إخباري أساسي"],
                        correctAnswer: 0
                    },
                    {
                        question: "في نظرية موجات إليوت، أي موجة تكون عادةً أطول وأقوى موجة دافعة؟",
                        options: ["الموجة 1", "الموجة 3", "الموجة 5"],
                        correctAnswer: 1
                    },
                    {
                        question: "ما هو العيب الرئيسي لاستخدام رافعة مالية عالية جدًا؟",
                        options: ["تقلل من الأرباح المحتملة", "تزيد بشكل كبير من خطر نداء الهامش والخسائر الكبيرة", "تبطئ تنفيذ الصفقات"],
                        correctAnswer: 1
                    },
                    {
                        question: "تستخدم 'يوميات التداول' بشكل أساسي لـ...",
                        options: ["مشاركة الإشارات مع المتداولين الآخرين", "تتبع وتحليل أدائك الشخصي للعثور على نقاط الضعف", "حساب الالتزامات الضريبية"],
                        correctAnswer: 1
                    },
                    {
                        question: "إلى ماذا يؤدي 'الخوف من فوات الفرصة' (FOMO) غالبًا في التداول؟",
                        options: ["دخول مدروس ومخطط له", "تجاهل خطة التداول لمطاردة سوق سريع الحركة", "اتخاذ مراكز أصغر وأكثر أمانًا"],
                        correctAnswer: 1
                    }
                ]
            }
        ]
    },
    es: {
        examTitle: "Examen de Conocimientos Final",
        pageDescription: "Responde todas las preguntas a continuación y envía para ver tu puntaje.",
        pageIndicator: (current: number, total: number) => `Página ${current} de ${total}`,
        nextButton: "Siguiente Página",
        prevButton: "Página Anterior",
        submitButton: "Entregar Examen",
        resultsTitle: "Resultados del Examen",
        scoreText: (score: number, total: number) => `Respondiste correctamente a ${score} de ${total} preguntas.`,
        passMessage: "¡Felicidades! Tienes una sólida comprensión de los conceptos básicos.",
        failMessage: "¡Buen esfuerzo! Recomendamos revisar las lecciones de nuevo para fortalecer tus conocimientos.",
        backToLearning: "Volver a la Ruta de Aprendizaje",
        retryExam: "Reintentar Examen",
        certificateName: "Nombre Completo para el Certificado",
        certificateNamePlaceholder: "Introduce tu nombre completo",
        downloadCertificate: "Descargar Certificado",
        passingScore: 70,
        certificate: {
            awardedBy: "Certificado de Distinción Otorgado por AURA ANALYTICS",
            completionText: "Por demostrar un conocimiento excepcional y completar con éxito el plan de estudios de AURA Academy. Este certificado se otorga por mérito, demostrando que eres un trader experimentado y reconocido.",
            gradePass: "COMPLETADO CON ÉXITO",
            gradeMaster: "COMPLETADO CON DISTINCIÓN"
        },
        pages: [
            {
                title: "Parte 1: Conceptos Básicos",
                questions: [
                    {
                        question: "¿Cuál es el término para la diferencia entre el precio de compra (bid) y el de venta (ask) de un par de divisas?",
                        options: ["Deslizamiento (Slippage)", "Diferencial (Spread)", "Margen (Margin)"],
                        correctAnswer: 1
                    },
                    {
                        question: "Un patrón de vela 'Martillo' (Hammer) en la parte inferior de una tendencia bajista se considera una...",
                        options: ["Señal de reversión bajista", "Señal de continuación", "Señal de reversión alcista"],
                        correctAnswer: 2
                    },
                    {
                        question: "Si colocas una orden para comprar EUR/USD a un precio *por encima* del precio de mercado actual, ¿qué tipo de orden es?",
                        options: ["Buy Limit", "Buy Stop", "Orden de mercado"],
                        correctAnswer: 1
                    },
                    {
                        question: "¿Qué tipo de análisis se centra en datos económicos como las tasas de interés y el PIB?",
                        options: ["Análisis Técnico", "Análisis Fundamental", "Análisis Sentimental"],
                        correctAnswer: 1
                    },
                    {
                        question: "Un patrón 'Envolvente Bajista' (Bearish Engulfing) es un patrón de dos velas que señala una posible...",
                        options: ["Continuación de la tendencia alcista", "Reversión de la tendencia bajista", "Techo y reversión bajista"],
                        correctAnswer: 2
                    },
                    {
                        question: "Una línea larga y plana que conecta varios máximos oscilantes en un gráfico se conoce como...",
                        options: ["Nivel de Soporte", "Línea de Tendencia", "Nivel de Resistencia"],
                        correctAnswer: 2
                    },
                    {
                        question: "El 'Cruce Dorado' (Golden Cross) es una señal alcista a largo plazo que ocurre cuando...",
                        options: ["La EMA de 50 cruza por debajo de la EMA de 200", "El RSI supera los 70", "La EMA de 50 cruza por encima de la EMA de 200"],
                        correctAnswer: 2
                    },
                    {
                        question: "¿Qué indica típicamente un valor de RSI de 25?",
                        options: ["Condiciones de sobrecompra", "Condiciones de sobreventa", "Una tendencia fuerte"],
                        correctAnswer: 1
                    },
                    {
                        question: "Si arriesgas $100 en una operación y tu objetivo de ganancia es de $300, ¿cuál es tu relación Riesgo/Beneficio?",
                        options: ["1:2", "1:3", "3:1"],
                        correctAnswer: 1
                    },
                    {
                        question: "¿Cuál es el propósito principal de una orden de Stop-Loss?",
                        options: ["Asegurar ganancias", "Limitar pérdidas potenciales", "Entrar en una operación a un mejor precio"],
                        correctAnswer: 1
                    }
                ]
            },
            {
                title: "Parte 2: Aplicación Práctica (Reconocimiento de Patrones)",
                questions: [
                    {
                        question: "Identifica el patrón que se muestra en la imagen de abajo.",
                        image: "https://picsum.photos/seed/h_and_s/600/400",
                        aiHint: "Head and Shoulders chart pattern",
                        options: ["Doble Techo", "Hombro-Cabeza-Hombro", "Triángulo Ascendente"],
                        correctAnswer: 1
                    },
                    {
                        question: "¿Qué indica este patrón de velas?",
                        image: "https://picsum.photos/seed/bull_engulf/600/400",
                        aiHint: "Bullish Engulfing chart pattern",
                        options: ["Una fuerte reversión bajista", "Continuación de una tendencia bajista", "Una fuerte reversión alcista"],
                        correctAnswer: 2
                    },
                    {
                        question: "Este patrón es un patrón de continuación clásico. ¿Cómo se llama?",
                        image: "https://picsum.photos/seed/bull_flag/600/400",
                        aiHint: "Bull Flag chart pattern",
                        options: ["Bandera Alcista", "Cuña Descendente", "Banderín Bajista"],
                        correctAnswer: 0
                    },
                     {
                        question: "¿Qué patrón se está formando en este gráfico?",
                        image: "https://picsum.photos/seed/double_bottom/600/400",
                        aiHint: "Double Bottom chart pattern",
                        options: ["Doble Suelo", "Hombro-Cabeza-Hombro Invertido", "Pinzas de Techo"],
                        correctAnswer: 0
                    },
                    {
                        question: "Este patrón a menudo precede a una ruptura bajista. ¿Cuál es?",
                        image: "https://picsum.photos/seed/desc_triangle/600/400",
                        aiHint: "Descending Triangle chart pattern",
                        options: ["Triángulo Simétrico", "Cuña Ascendente", "Triángulo Descendente"],
                        correctAnswer: 2
                    },
                    {
                        question: "Identifica el patrón indicado por la flecha.",
                        image: "https://picsum.photos/seed/shooting_star/600/400",
                        aiHint: "Shooting Star candlestick",
                        options: ["Martillo", "Estrella Fugaz", "Doji"],
                        correctAnswer: 1
                    },
                    {
                        question: "¿Cómo se llama este patrón de reversión de tres velas?",
                        image: "https://picsum.photos/seed/morning_star/600/400",
                        aiHint: "Morning Star chart pattern",
                        options: ["Estrella del Atardecer", "Tres Soldados Blancos", "Estrella de la Mañana"],
                        correctAnswer: 2
                    },
                    {
                        question: "Este patrón sugiere una posible ruptura al alza. ¿Cuál es?",
                        image: "https://picsum.photos/seed/asc_triangle/600/400",
                        aiHint: "Ascending Triangle chart pattern",
                        options: ["Triángulo Ascendente", "Bandera Bajista", "Cuña Descendente"],
                        correctAnswer: 0
                    },
                     {
                        question: "Este patrón señala una fuerte presión bajista. ¿Cuál es?",
                        image: "https://picsum.photos/seed/three_crows/600/400",
                        aiHint: "Three Black Crows chart pattern",
                        options: ["Tres Cuervos Negros", "Pinzas de Fondo", "Tres Soldados Blancos"],
                        correctAnswer: 0
                    },
                    {
                        question: "¿Qué significa esta vela, que aparece después de una tendencia bajista?",
                        image: "https://picsum.photos/seed/hammer_candle/600/400",
                        aiHint: "Hammer candlestick chart",
                        options: ["Hombre Colgado", "Envolvente Bajista", "Martillo"],
                        correctAnswer: 2
                    }
                ]
            },
            {
                title: "Parte 3: Conceptos Avanzados y Gestión de Riesgos",
                questions: [
                    {
                        question: "¿Cuál es el porcentaje máximo de tu cuenta de trading que deberías arriesgar en una sola operación, según la regla del 1%?",
                        options: ["1%", "5%", "10%"],
                        correctAnswer: 0
                    },
                    {
                        question: "Una orden 'Trailing Stop' se utiliza para...",
                        options: ["Entrar en una operación a un precio específico", "Proteger las ganancias en una operación ganadora", "Añadir más a una posición perdedora"],
                        correctAnswer: 1
                    },
                    {
                        question: "El 'trading por venganza' es una trampa psicológica en la que un trader...",
                        options: ["Intenta recuperar las pérdidas con operaciones más grandes y arriesgadas", "Solo opera con una alta relación recompensa/riesgo", "Se adhiere estrictamente a su plan de trading"],
                        correctAnswer: 0
                    },
                    {
                        question: "¿Qué significa 'confluencia' en el análisis técnico?",
                        options: ["Cuando dos indicadores dan señales opuestas", "Cuando múltiples indicadores o patrones independientes sugieren la misma idea de trading", "La superposición de dos sesiones de trading importantes"],
                        correctAnswer: 1
                    },
                    {
                        question: "Si el tamaño de tu cuenta es de $10,000 y arriesgas el 2% por operación, ¿cuál es la cantidad máxima en dólares que deberías arriesgar?",
                        options: ["$100", "$200", "$500"],
                        correctAnswer: 1
                    },
                    {
                        question: "¿Qué es una 'toma de liquidez' o 'caza de stops' en los conceptos de ICT?",
                        options: ["Un pico de precio repentino diseñado para activar órdenes de stop-loss antes de moverse en la dirección prevista", "Un período de bajo volumen de operaciones", "Un anuncio de noticias fundamentales"],
                        correctAnswer: 0
                    },
                    {
                        question: "En la teoría de las Ondas de Elliott, ¿qué onda es típicamente la onda de impulso más larga y fuerte?",
                        options: ["Onda 1", "Onda 3", "Onda 5"],
                        correctAnswer: 1
                    },
                    {
                        question: "¿Cuál es la principal desventaja de usar un apalancamiento muy alto?",
                        options: ["Reduce las ganancias potenciales", "Aumenta significativamente el riesgo de una llamada de margen y grandes pérdidas", "Ralentiza la ejecución de las operaciones"],
                        correctAnswer: 1
                    },
                    {
                        question: "Un 'diario de trading' se utiliza principalmente para...",
                        options: ["Compartir señales con otros traders", "Rastrear y analizar tu propio rendimiento para encontrar debilidades", "Calcular las obligaciones fiscales"],
                        correctAnswer: 1
                    },
                    {
                        question: "¿A qué conduce a menudo el 'FOMO' (Miedo a Quedarse Fuera) en el trading?",
                        options: ["Entradas cuidadosas y planificadas", "Ignorar tu plan de trading para perseguir un mercado en rápido movimiento", "Tomar posiciones más pequeñas y seguras"],
                        correctAnswer: 1
                    }
                ]
            }
        ]
    }
};
