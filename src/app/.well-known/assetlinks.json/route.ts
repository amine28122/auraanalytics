import { NextResponse } from 'next/server';
import assetLinks from '@/lib/assetlinks.json';

export async function GET() {
  return NextResponse.json(assetLinks);
}
