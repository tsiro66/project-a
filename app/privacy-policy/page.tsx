'use client'
import { useEffect } from 'react';
import PrivacyPolicy from './PrivacyPolicy';

export default function PrivacyPolicyPage() {
    useEffect(() => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }, []);

    return <PrivacyPolicy />;
}