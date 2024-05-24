import { EmbedBuilder, Client, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import { getTournaments } from "./services/tournament.services";
import { TournamentQueryResult, User } from "./services/types";

dotenv.config();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US");
  const formattedTime = date.toLocaleTimeString("en-Us", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { formattedDate, formattedTime };
};

const parseFaceItUrl = (faceitUrl: string, lang: string = "en"): string => {
  return faceitUrl.replace("{lang}", lang);
};

const createEmbed = (title: string, t: TournamentQueryResult) => {
  const faceitUrl = parseFaceItUrl(t.faceitUrl);
  const { formattedDate, formattedTime } = formatDate(t.date);

  return new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setDescription(t.title)
    .setTimestamp(new Date())
    .setThumbnail("https://www.battle.tech/icon-512x512.png")
    .addFields(
      { name: "Tournament Status", value: t.status },
      { name: "Start Date", value: formattedDate, inline: true },
      { name: "Start Time", value: formattedTime, inline: true },
      { name: "Region", value: t.region },
      { name: "Faceit URL", value: faceitUrl },
    );
};

const sendUpcomingTournamentInfos = async (
  client: Client,
  channelId: string,
): Promise<void> => {
  try {
    const { startingSoonTournaments, checkinTimeTournaments } =
      await getTournaments();

    const channel = client.channels.cache.get(channelId) as TextChannel;

    switch (true) {
      case channel === undefined:
        console.log("Channel not found");
        return;
      default:
        startingSoonTournaments.forEach((t: any) => {
          const embed = createEmbed("TOURNAMENT STARTING SOON!", t);
          channel.send({ embeds: [embed] });
        });

        checkinTimeTournaments.forEach((t: any) => {
          const embed = createEmbed("TOURNAMENT CHECKIN TIME!", t);
          channel.send({ embeds: [embed] });
        });

      // ongoingTournaments.forEach((t: any) => {
      //   const embed = createEmbed("ONGOING TOURNAMENT!", t);
      //   channel.send({ embeds: [embed] });
      // });
    }
  } catch (e) {
    console.error("Error sending message =>", e);
  }
};

const sendCompletedTournamentInfos = async (
  client: Client,
  channelId: string,
): Promise<void> => {
  try {
    const { completedTournaments } = await getTournaments();
    const channel = client.channels.cache.get(channelId) as TextChannel;

    switch (true) {
      case channel === undefined:
        console.log("Channel not found");
        return;
      default:
        completedTournaments.forEach((t: TournamentQueryResult) => {
          const embed = createEmbed("TOURNAMENT COMPLETED!", t);
          const tournamentTeam = t.winners.map((x: any) => {
            if (!x.tournamentTeam || !x.tournamentTeam.members) {
              return [];
            }

            const members = x.tournamentTeam.members.map((y: any) => {
              const user: any = {
                avatarUrl: y.avatarUrl,
                name: y.name,
                link: `https://www.battle.tech/${encodeURIComponent(y.name)}`,
              };
              return user;
            });
            return {
              position: x.position,
              amount: x.amount,
              members: members,
            };
          });

          const winners = tournamentTeam
            .sort((a: any, b: any) => a.position - b.position)
            .map((p: any) => {
              const members = p.members.map((m: any) => {
                return `[${m.name}](${m.link})`;
              });
              return `${p.position}: ${members.join(", ")}`;
            })
            .join("\n");

          embed.addFields(
            { name: "winners", value: winners },
            { name: "Payment Status", value: t.paymentStatus },
          );

          channel.send({ embeds: [embed] });
        });
    }
  } catch (e) {}
};

const sendPayoutInfos = async (
  client: Client,
  channelId: string,
): Promise<void> => {
  const { paidOutTournaments } = await getTournaments();
  const channel = client.channels.cache.get(channelId) as TextChannel;

  switch (true) {
    case channel === undefined:
      console.log("Channel not found");
      return;
    default:
      paidOutTournaments.forEach((t: TournamentQueryResult) => {
        const embed = createEmbed("PAYOUTS ARE OUT!", t);
        const tournamentTeam = t.winners.map((x: any) => {
          if (!x.tournamentTeam || !x.tournamentTeam.members) {
            return [];
          }

          const members = x.tournamentTeam.members.map((y: any) => {
            const user: any = {
              avatarUrl: y.avatarUrl,
              name: y.name,
              link: `https://www.battle.tech/${encodeURIComponent(y.name)}`,
            };
            return user;
          });
          return {
            position: x.position,
            amount: x.amount,
            members: members,
          };
        });

        const winners = tournamentTeam
          .sort((a: any, b: any) => a.position - b.position)
          .map((p: any) => {
            const members = p.members.map((m: any) => {
              return `[${m.name}](${m.link})`;
            });
            return `${p.position}: ${members.join(", ")}`;
          })
          .join("\n");

        embed.addFields(
          { name: "winners", value: winners },
          { name: "Payment Status", value: t.paymentStatus },
        );

        channel.send({ embeds: [embed] });
      });
  }
};

export const checkUpcomingTournaments = async (
  client: Client,
  channelId: string,
): Promise<void> => {
  try {
    const { startingSoonTournaments, checkinTimeTournaments } =
      await getTournaments();

    if (
      startingSoonTournaments.length > 0 ||
      checkinTimeTournaments.length > 0
    ) {
      // console.log("upcoming tournaments found", startingSoonTournaments.length);
      // console.log("ongoing tournaments found", ongoingTournaments.length);
      sendUpcomingTournamentInfos(client, channelId);
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkCompletedTournaments = async (
  client: Client,
  channelId: string,
): Promise<void> => {
  try {
    const { completedTournaments } = await getTournaments();
    if (completedTournaments.length > 0) {
      sendCompletedTournamentInfos(client, channelId);
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkPayoutTournaments = async (
  client: Client,
  channelId: string,
): Promise<void> => {
  try {
    const { paidOutTournaments } = await getTournaments();
    if (paidOutTournaments.length > 0) {
      sendPayoutInfos(client, channelId);
    }
  } catch (error) {
    console.log(error);
  }
};
