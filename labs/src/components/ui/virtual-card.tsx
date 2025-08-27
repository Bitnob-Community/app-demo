import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VirtualCardProps {
  card?: {
    id: string;
    cardNumber?: string;
    last4: string;
    cardName: string;
    cardType: string;
    cardBrand: string;
    expiry: string;
    valid: string;
    status: string;
    balance?: number;
    cvv2?: string;
    createdStatus: string;
  };
  className?: string;
}

export function VirtualCard({ card, className }: VirtualCardProps) {
  if (!card) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'terminated': return 'text-red-600 bg-red-50';
      case 'frozen': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getBrandColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'bg-gradient-to-r from-blue-600 to-blue-800';
      case 'mastercard': return 'bg-gradient-to-r from-red-600 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-700 to-gray-900';
    }
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <Card className={cn(
        "p-6 text-white relative overflow-hidden h-56 flex flex-col justify-between",
        getBrandColor(card.cardBrand)
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-white"></div>
          <div className="absolute top-8 right-8 w-8 h-8 rounded-full border-2 border-white"></div>
        </div>

        {/* Card Header */}
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wider">{card.cardType}</p>
            <div className={cn(
              "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1",
              getStatusColor(card.status)
            )}>
              {card.status}
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold uppercase">{card.cardBrand}</p>
          </div>
        </div>

        {/* Card Number */}
        <div className="relative z-10">
          <p className="text-lg font-mono tracking-widest">
            {card.cardNumber || `•••• •••• •••• ${card.last4}`}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-xs opacity-80 uppercase">Card Holder</p>
            <p className="font-medium truncate max-w-40">{card.cardName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80 uppercase">Expires</p>
            <p className="font-medium font-mono">{card.valid}</p>
          </div>
        </div>

        {/* Balance (if available) */}
        {typeof card.balance === 'number' && (
          <div className="absolute top-4 left-4 bg-black/20 rounded-lg p-2 backdrop-blur-sm">
            <p className="text-xs opacity-80">Balance</p>
            <p className="font-bold">${card.balance.toFixed(2)}</p>
          </div>
        )}
      </Card>

      {/* Card Details */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Card ID:</span>
          <span className="font-mono text-xs">{card.id.slice(0, 8)}...</span>
        </div>
        {card.cvv2 && (
          <div className="flex justify-between mt-1">
            <span>CVV:</span>
            <span className="font-mono">•••</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface CardGridProps {
  cards: any[];
  className?: string;
}

export function CardGrid({ cards, className }: CardGridProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {cards.map((card) => (
        <VirtualCard key={card.id} card={card} />
      ))}
    </div>
  );
}

interface UserCardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    customerEmail: string;
    phoneNumber: string;
    country: string;
    city: string;
    state: string;
    kycPassed: boolean;
    cardBrand: string;
  };
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600">{user.customerEmail}</p>
            <p className="text-xs text-gray-500">{user.phoneNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn(
            "inline-block px-2 py-1 rounded-full text-xs font-medium",
            user.kycPassed ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}>
            {user.kycPassed ? "KYC Verified" : "KYC Pending"}
          </div>
          <p className="text-xs text-gray-500 mt-1 uppercase">{user.cardBrand}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-600">
          📍 {user.city}, {user.state}, {user.country}
        </p>
        <p className="text-xs text-gray-500 mt-1">ID: {user.id.slice(0, 8)}...</p>
      </div>
    </Card>
  );
}

interface TransactionCardProps {
  transaction: {
    id: string;
    amount: string;
    type: string;
    method: string;
    narrative: string;
    status: string;
    currency: string;
    createdAt: string;
    cardBalanceAfter: string;
  };
  className?: string;
}

export function TransactionCard({ transaction, className }: TransactionCardProps) {
  const getTypeColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold",
            transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
          )}>
            {transaction.type === 'credit' ? '+' : '−'}
          </div>
          <div>
            <p className="font-medium">{transaction.narrative}</p>
            <p className="text-sm text-gray-600 capitalize">{transaction.method}</p>
            <p className="text-xs text-gray-500">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("font-bold text-lg", getTypeColor(transaction.type))}>
            {transaction.type === 'credit' ? '+' : '−'}${transaction.amount}
          </p>
          <div className={cn(
            "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1",
            getStatusColor(transaction.status)
          )}>
            {transaction.status}
          </div>
          <p className="text-xs text-gray-500 mt-1 uppercase">{transaction.currency}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-600">
        <span>Balance After: ${transaction.cardBalanceAfter}</span>
        <span>ID: {transaction.id.slice(0, 8)}...</span>
      </div>
    </Card>
  );
}