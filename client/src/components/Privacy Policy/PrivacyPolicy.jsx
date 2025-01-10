import NavBar from '../Navigation Bars/NavBar';
import BottomBar from '../Navigation Bars/BottomBar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Section from './PrivacyPolicySection';

const sections = [
    {
        header: "Introduction",
        body1: `At KbSpas, your privacy is of the utmost importance to us. This Privacy Policy outlines how your personal information is collected, used, and 
        safeguarded when you book an appointment with us. By booking an appointment, you agree to the collection and use of your information in accordance with this 
        policy.`,
    },
    {
        header: "Information We Collect",
        body1: `When you book an appointment, we collect the following information from you:`,
        listItems: [`your name;`, `your email address;`, `your phone number; and`, `your agreement to the Eyelash Technician Services Waiver and Agreement.`],
        body2: `While we charge deposits online, we do not handle your payment information directly (see Third Party Services).`,
    },
    {
        header: "How We Use Your Information",
        body1: `The information we collect from you is used for the following purposes:`,
        listItems: [`to schedule, reschedule, or cancel appointments;`, `to process payment for the service(s) you've booked;`, 
        `to send you appointment confirmations, promotional offers, and other related communications; and`,
        `to comply with legal requirements.`],
        body2: `Your information is never used or shared outside of KbSpas.`,
    },
    {
        header: "How We Protect Your Information",
        body1: `All data transferred between our website and your device is encrypted. We use reputable third-party services (MongoDB and Stripe) that maintain high 
        standards for data protection.`,
    },
    {
        header: "Third Party Services",
        body1: `We utilize third-party services for the following purposes:`,
        listItems: [`Stripe to process payments. Stripe is a secure payment processing platform that employs advanced encryption. Stripe has its own privacy policy 
        that dictates how your personal information is used. For more information, please refer to Stripe's Privacy Policy.`, 
        `MongoDB to temporarily store the information we collect from you and your appointment details. MongoDB is a database service that uses authentication, 
        encryption at rest and in transit, and auditing to protect data.`],
    },
    {
        header: "Your Rights",
        body1: `You have the right to:`,
        listItems: [`access the personal data we hold about you;`, `ask us to update or correct any outdated or incorrect personal data we hold about you; and`, 
        `ask us to delete any personal data we hold about you.`],
        body2: `To exercise any of these rights, please contact us directly.`,
    },
    {
        header: "Changes to Privacy Policy",
        body1: `From time to time, we may update this Privacy Policy. Any changes will be posted on this page with an updated effective date.`,
    },
    {
        header: "Contact Us",
        body1: `For any questions or concerns regarding this Privacy Policy, or to exercise your rights as detailed above, please contact us at 
        kbspasmain@gmail.com.`,
    },
    
];

function PrivacyPolicy() { 
    return ( 
        <>
            <NavBar/>
                <Grid container sx={{paddingX: 2, paddingY: 4}}>
                    <Grid item xs={12}>
                        <Typography sx={{fontWeight: 700, fontSize: '30px'}}>Privacy Policy</Typography>
                        <Typography sx={{fontSize: '14px'}}>Effective: 11/18/2023</Typography>
                    </Grid>

                    {sections.map((section, index) => (
                        <Section
                            key={index}
                            header={section.header}
                            body1={section.body1}
                            listItems={section.listItems}
                            body2={section.body2}
                        />
                    ))}
                    <Grid item xs={12} sx={{paddingBottom: 4}}></Grid>
                </Grid>
            <BottomBar/>
        </>
    );
}

export default PrivacyPolicy;