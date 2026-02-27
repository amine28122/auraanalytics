'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        const isAr = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
        const t = {
            title: isAr ? 'حدث خطأ ما' : 'Something went wrong',
            description: isAr
                ? 'حدث خطأ غير متوقع في هذا القسم. قد يكون ذلك بسبب مشكلة مؤقتة أو ملف كبير الحجم.'
                : 'An unexpected error occurred in this section. This might be due to a temporary issue or a large file.',
            reload: isAr ? 'إعادة تحميل الصفحة' : 'Reload Page'
        };

        if (this.state.hasError) {
            return (
                <div className="flex min-h-[400px] w-full items-center justify-center p-4 text-center">
                    <Card className="max-w-md border-destructive/20 bg-destructive/5 card-glow">
                        <CardHeader>
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <CardTitle className="text-xl font-headline">{t.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {t.description}
                            </p>
                            {process.env.NODE_ENV === 'development' && (
                                <pre className="mt-4 overflow-auto rounded bg-black/20 p-3 text-left text-[10px] text-destructive font-mono border border-destructive/10">
                                    {this.state.error?.message}
                                </pre>
                            )}
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button
                                onClick={() => {
                                    this.setState({ hasError: false, error: null });
                                    window.location.reload();
                                }}
                                className="gap-2 bg-primary hover:bg-primary/90"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                {t.reload}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
