export enum TournamentStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TournamentPaymentStatus {
  PENDING = "PENDING",
  DISPUTE = "DISPUTE",
  COMPLETED = "COMPLETED",
}

export enum TournamentRegion {
  EU = "EU",
  US = "US",
  SA = "SA",
  SEA = "SEA",
  OCE = "OCE",
}

export enum TournamentGame {
  CS2 = "CS2",
}

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}
export enum TournamentEntryType {
  FREE = "FREE",
  PAID = "PAID",
}

export type TournamentQueryResult = {
  id: string;
  region: TournamentRegion;
  status: TournamentStatus;
  prizeCurrency: string;
  paymentStatus: TournamentPaymentStatus;
  title: string;
  tournamentType: string;
  participants: {
    userId: string;
    name: string;
    paidEntry: boolean;
    avatarUrl: string;
  }[];
  isPaidEntry: boolean;
  entryFee: string;
  date: string;
  checkinStart: string;
  entryEndTime: string;
  refundEndTime: string;
  slots: number;
  slotsFilled: number;
  faceitUrl: string;
  winners: {
    position: number;
    amount: number;
    tournamentTeam: {
      members: {
        avatarUrl: string;
        name: string;
      }[];
    };
  }[];
  prizeItems: {
    position: number;
    amount: string;
  }[];
  data: {
    faceIt: {
      checkinStart: string;
      currentSubscriptions: number;
      faceitUrl: string;
      slots: number;
    };
  };
};

export type Tournaments = {
  tournaments: TournamentQueryResult[];
};

export type Tournament = {
  status?: TournamentStatus;
  userId?: string;
  teamId?: string;
  entryType?: TournamentEntryType;
  search?: string | undefined;
  sortBy?: string;
};

export type User = {
  userId: string;
  name: string;
  paidEntry: boolean;
  avatarUrl: string;
};
