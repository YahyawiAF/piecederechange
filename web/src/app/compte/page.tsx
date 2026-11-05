import type { Metadata } from "next";
import { getCustomer } from "@/lib/data";
import { tierFor } from "@/lib/loyalty";
import { WRAP } from "@/lib/ui";
import { AccountLinks, GarageList, LoyaltyCard, LoyaltySummary, NotificationPrefs, PointsHistory, ProfileCard, Rewards } from "@/components/account";

export const metadata: Metadata = { title: "Mon compte" };

export default async function AccountPage() {
  const customer = await getCustomer();
  const tier = tierFor(customer.earned12m);
  return (
    <main className={`${WRAP} pt-4 md:pt-8`}>
      <div className="mb-5">
        <h1 className="disp text-[30px] md:text-5xl">Bonjour {customer.firstName}</h1>
        <p className="mt-1 text-sm text-mut">Votre carte fidélité, vos récompenses et vos réglages.</p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] lg:gap-8">
        <div className="flex flex-col gap-6">
          <section aria-label="Carte fidélité" className="grid grid-cols-[minmax(0,1fr)] items-center gap-4 md:grid-cols-[minmax(0,480px)_minmax(0,1fr)] md:gap-6">
            <LoyaltyCard customer={customer} tier={tier} />
            <LoyaltySummary customer={customer} tier={tier} />
          </section>
          <Rewards points={customer.points} />
          <PointsHistory history={customer.history} />
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <ProfileCard customer={customer} tier={tier} />
          <GarageList />
          <NotificationPrefs />
          <AccountLinks />
        </aside>
      </div>
    </main>
  );
}
