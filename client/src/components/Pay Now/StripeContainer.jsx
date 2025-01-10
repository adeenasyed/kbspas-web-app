import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js";
import PayNow from "./PayNow";

function StripeContainer({selectedService, selectedLocation, selectedDate, selectedTimeSlot, total, bypass}) { 
    const PUBLIC_KEY=process.env.STRIPE_PUBLIC_KEY;
    const stripePromise = loadStripe(PUBLIC_KEY);
    return ( 
        <Elements stripe={stripePromise}>
            <PayNow selectedService={selectedService} selectedLocation={selectedLocation} selectedDate={selectedDate} selectedTimeSlot={selectedTimeSlot} total={total} bypass={bypass}/>
        </Elements>
    );
}

export default StripeContainer;