import { type NextRequest, NextResponse } from "next/server";
import { 
  registerCardUser,
  updateCardUser,
  createVirtualCard,
  topupCard,
  getCards,
  getUsers,
  getUser,
  getCard,
  getCardTransactions,
  getAllTransactions,
  withdrawFromCard,
  freezeCard,
  unfreezeCard,
  mockTransaction,
  terminateCard,
  enableAirlines
} from "@/lib/virtual-cards";

export async function POST(req: NextRequest) {
  const { action, ...data } = await req.json();

  try {
    let response;
    
    switch (action) {
      case "register":
        response = await registerCardUser(data);
        break;
      case "create":
        response = await createVirtualCard(data);
        break;
      case "topup":
        response = await topupCard(data);
        break;
      case "withdraw":
        response = await withdrawFromCard(data);
        break;
      case "freeze":
        response = await freezeCard(data);
        break;
      case "unfreeze":
        response = await unfreezeCard(data);
        break;
      case "terminate":
        response = await terminateCard(data);
        break;
      case "mock-transaction":
        response = await mockTransaction(data);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.log("Virtual Cards Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");

  try {
    let response;

    switch (action) {
      case "cards":
        response = await getCards();
        break;
      case "users":
        response = await getUsers();
        break;
      case "user":
        if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
        response = await getUser(id);
        break;
      case "card":
        if (!id) return NextResponse.json({ error: "Card ID required" }, { status: 400 });
        response = await getCard(id);
        break;
      case "transactions":
        if (id) {
          response = await getCardTransactions(id);
        } else {
          response = await getAllTransactions();
        }
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.log("Virtual Cards Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { action, id, ...data } = await req.json();

  try {
    let response;

    switch (action) {
      case "update-user":
        if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
        response = await updateCardUser(id, data);
        break;
      case "enable-airlines":
        response = await enableAirlines(data);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.log("Virtual Cards Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}