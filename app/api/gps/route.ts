import { NextResponse } from "next/server";
import { ShuttleData } from "@/types/shuttle";

const shuttleData: ShuttleData[] = [];


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { device_id, lat, lng, speed } = body;

    if (!device_id || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: device_id, lat, or lng" },
        { status: 400 }
      );
    }


    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        { error: "Invalid coordinates: lat and lng must be numbers" },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: "Invalid coordinates: lat must be between -90 and 90, lng between -180 and 180" },
        { status: 400 }
      );
    }

   
    const shuttleIndex = shuttleData.findIndex(s => s.device_id === device_id);
    const shuttleUpdate: ShuttleData = {
      device_id,
      lat,
      lng,
      speed: speed !== undefined ? Number(speed) : 0,
      updated: new Date().toISOString(),
    };

    if (shuttleIndex >= 0) {
      shuttleData[shuttleIndex] = shuttleUpdate;
    } else {
      shuttleData.push(shuttleUpdate);
    }

    return NextResponse.json({ success: true, device_id });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON or request format" },
      { status: 400 }
    );
  }
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const device_id = searchParams.get("device_id");


  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');


  if (device_id) {
    const data = shuttleData.find(s => s.device_id === device_id);
    if (!data) {
      return NextResponse.json(
        { message: "No data found for this device" },
        { status: 404, headers }
      );
    }
    return NextResponse.json(data, { headers });
  }

  return NextResponse.json(shuttleData, { headers });
}
