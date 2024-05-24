import * as dotenv from "dotenv";
import { TournamentQueryResult, TournamentStatus } from "./types";
import axios from "axios";

dotenv.config();
const url = `${process.env.API_URL}`;

const fetchTournaments = async (
  status: TournamentStatus,
): Promise<TournamentQueryResult[]> => {
  let tournaments: TournamentQueryResult[] = [];
  let i = 1;
  let totalPages = 1;
  try {
    do {
      const response = await axios.get(
        `${url}/tournaments?page=${i}&size=20&status=${status}`,
      );
      const data = await response.data;

      if (data.pagination) {
        totalPages = data.pagination.lastPage;
      }

      console.log(`Fetching page ${i} of ${totalPages}`);
      tournaments = tournaments.concat(data.wagers);
      i++;
    } while (i <= totalPages);
    console.log(`Total ${status} tournaments fetched: ${tournaments.length}`);
    return tournaments;
  } catch (error) {
    console.error("Error fetching tournaments", error);
    throw error;
  }
};

export const getTournaments = async () => {
  try {
    const now = new Date();
    const tournaments = await fetchTournaments(TournamentStatus.ACTIVE);
    const completedTournament = await fetchTournaments(
      TournamentStatus.COMPLETED,
    );

    const startingSoonTournaments = tournaments.filter(
      (t: TournamentQueryResult) => {
        // t.date is check in time
        const startDate = new Date(t.date);
        const diff = startDate.getTime() - now.getTime();
        const diffInHours = diff / (1000 * 3600);
        return diffInHours <= 2 && diffInHours > 0;
      },
    );

    const checkinTimeTournaments = tournaments.filter(
      (t: TournamentQueryResult) => {
        const startDate = new Date(t.date);
        const diff = startDate.getTime() - now.getTime();
        const diffInMinutes = diff / (1000 * 60);
        // diff should be at least 1.5 hours no more
        return diffInMinutes <= 0 && diffInMinutes >= -90;
      },
    );

    const completedTournaments = completedTournament.filter(
      (t: TournamentQueryResult) => {
        const startDate = new Date(t.date);
        const diff = now.getTime() - startDate.getTime();
        const diffInHours = Math.floor(diff / (1000 * 3600));
        return diffInHours <= 24 && diffInHours >= 0;
      },
    );
    // console.log(`completed tourneys -> ${completedTournaments}`);

    const paidOutTournaments = completedTournament
      .filter((t: TournamentQueryResult) => t.paymentStatus === "COMPLETED")
      .filter((t: TournamentQueryResult) => {
        const startDate = new Date(t.date);
        const diff = now.getTime() - startDate.getTime();
        const diffInHours = Math.floor(diff / (1000 * 3600));
        return diffInHours <= 48 && diffInHours >= 0;
      });
    console.log(`paid out tourneys -> ${paidOutTournaments}`);

    return {
      checkinTimeTournaments,
      startingSoonTournaments,
      completedTournaments,
      paidOutTournaments,
    };
  } catch (error) {
    console.error("Error getting tournaments", error);
    throw error;
  }
};
