import React from "react";
import Tokens from "@/components/money/tokens";
import ConfirmationPage from "@/components/donations/Confirmation";

export default function MoneyPage() {
  return (
    // <Tokens />

    <ConfirmationPage
      type="money"
      celebrant="Sarah"
      token="USDT"
      address="0x42f82A1Fb3D73fE1a09b78D294F7AbC4dC909999"
    />

  );
}
