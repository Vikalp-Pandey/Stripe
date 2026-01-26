import {stripe} from "./stripe"

// Create a Connected Account
export const createConnectedAccount = async (email:string) => {
    return await stripe.accounts.create({
     type: "express",
     email,
        capabilities:{
            card_payments:{requested:true},
            transfers:{requested:true}
        }
    })
}


/*
{
  id: 'acct_1SsRUuGguNjWo6CL',
  object: 'account',
  business_profile: {
    annual_revenue: null,
    estimated_worker_count: null,
    mcc: null,
    minority_owned_business_designation: null,
    name: null,
    product_description: null,
    specified_commercial_transactions_act_url: null,
    support_address: null,
    support_email: null,
    support_phone: null,
    support_url: null,
    url: null
  },
  business_type: null,
  capabilities: { card_payments: 'inactive', transfers: 'inactive' },
  charges_enabled: false,
  controller: {
    fees: { payer: 'application_express' },
    is_controller: true,
    losses: { payments: 'application' },
    requirement_collection: 'stripe',
    stripe_dashboard: { type: 'express' },
    type: 'application'
  },
  country: 'US',
  created: 1769102206,
  default_currency: 'usd',
  details_submitted: false,
  email: 'seller4@gmail.com',
  external_accounts: {
    object: 'list',
    data: [],
    has_more: false,
    total_count: 0,
    url: '/v1/accounts/acct_1SsRUuGguNjWo6CL/external_accounts'
  },
  future_requirements: {
    alternatives: [],
    current_deadline: null,
    currently_due: [ 'external_account', 'tos_acceptance.date', 'tos_acceptance.ip' ],
    disabled_reason: null,
    errors: [],
    eventually_due: [ 'external_account', 'tos_acceptance.date', 'tos_acceptance.ip' ],
    past_due: [ 'external_account', 'tos_acceptance.date', 'tos_acceptance.ip' ],
    pending_verification: []
  },
  login_links: {
    object: 'list',
    data: [],
    has_more: false,
    total_count: 0,
    url: '/v1/accounts/acct_1SsRUuGguNjWo6CL/login_links'
  },
  metadata: {},
  payouts_enabled: false,
  requirements: {
    alternatives: [ [Object] ],
    current_deadline: null,
    currently_due: [
      'business_profile.mcc',
      'business_profile.url',
      'business_type',
      'external_account',
      'representative.dob.day',
      'representative.dob.month',
      'representative.dob.year',
      'representative.email',
      'representative.first_name',
      'representative.last_name',
      'settings.payments.statement_descriptor',
      'tos_acceptance.date',
      'tos_acceptance.ip'
    ],
    disabled_reason: 'requirements.past_due',
    errors: [],
    eventually_due: [
      'business_profile.mcc',
      'business_profile.url',
      'business_type',
      'external_account',
      'representative.dob.day',
      'representative.dob.month',
      'representative.dob.year',
      'representative.email',
      'representative.first_name',
      'representative.last_name',
      'settings.payments.statement_descriptor',
      'tos_acceptance.date',
      'tos_acceptance.ip'
    ],
    past_due: [
      'business_profile.mcc',
      'business_profile.url',
      'business_type',
      'external_account',
      'representative.dob.day',
      'representative.dob.month',
      'representative.dob.year',
      'representative.email',
      'representative.first_name',
      'representative.last_name',
      'settings.payments.statement_descriptor',
      'tos_acceptance.date',
      'tos_acceptance.ip'
    ],
    pending_verification: []
  },
  settings: {
    bacs_debit_payments: { display_name: null, service_user_number: null },
    branding: {
      icon: null,
      logo: null,
      primary_color: null,
      secondary_color: null
    },
    card_issuing: { tos_acceptance: [Object] },
    card_payments: {
      decline_on: [Object],
      statement_descriptor_prefix: null,
      statement_descriptor_prefix_kana: null,
      statement_descriptor_prefix_kanji: null
    },
    dashboard: { display_name: null, timezone: 'Etc/UTC' },
    invoices: {
      default_account_tax_ids: null,
      hosted_payment_method_save: 'offer'
    },
    payments: {
      statement_descriptor: null,
      statement_descriptor_kana: null,
      statement_descriptor_kanji: null
    },
    payouts: {
      debit_negative_balances: true,
      schedule: [Object],
      statement_descriptor: null
    },
    paypay_payments: {},
    sepa_debit_payments: {}
  },
  tos_acceptance: { date: null, ip: null, user_agent: null },
  type: 'express'
}
INFO: On Boarding Url
https://connect.stripe.com/setup/e/acct_1SsRUuGguNjWo6CL/XRBtGykNfIUY
*/




// Generate onboarding or refresh link
export const createAccountLink = async (accountId:string) => {
    const link = await stripe.accountLinks.create({
        account:accountId,
        refresh_url: `http://localhost:3000/api/payment/onboarding/refresh/${accountId}`,

        // Redirect Url (where stripe redirects you after you created a seller onboarding account)
        return_url: `http://localhost:3000/api/payment/onboarding/success/${accountId}`,
        type: "account_onboarding",
    })

    return link.url;
}


export const getAccountStatus = async (accountId:string) => {
    const account = await stripe.accounts.retrieve(accountId);

    // Retrieve balance of seller Account ({} means empty params)
    const balance = await stripe.balance.retrieve({},{stripeAccount:accountId});

    // const account = await stripe.accounts.retrieve(destinationAccountId);

    // if (!account.capabilities?.transfers || account.capabilities.transfers !== "active") {
    // throw new Error("Seller account is not eligible to receive transfers yet.");
    // }

    return {
        balance:balance,
        detail:account,
        accoutType:account.type,
        id:account.id,
        email:account.email,
        chargesEnabled: account.charges_enabled,
        payoutsEnables: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
        requirements:account.requirements,
        capabilites:account.capabilities,

    }
}


export const createPayment = async (amount:string,currency:string) => {

    // Stripe Expects Amount to be Integer (99.99$ to 9999)
    const paymentIntent = await stripe.paymentIntents.create({
        amount:  Math.round(parseFloat(amount)*100),
        currency,
        automatic_payment_methods:{
            enabled:true,
            allow_redirects: "never", 
        }
        // Then you can immediately confirm it with a test card (pm_card_visa) and no return_url is required.
    })
  
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {
        payment_method: "pm_card_visa", // Stripe test card PaymentMethod
        }
    );
    // Step 3: Return the confirmed PaymentIntent
    return confirmedPaymentIntent;
      
}

//^ For sending money from the platform (main buisness account ) to sellers
export const createTransfer = async (amount:string,currency:string,destinationAccountId:string) => {
    const transfer = await stripe.transfers.create({
        amount: Math.round(parseFloat(amount)*100),
        currency,
        destination: destinationAccountId,
    })
    return transfer;
}

const stripeService = {
    createConnectedAccount,
    createAccountLink,
    getAccountStatus,
    createPayment,
    createTransfer
}

export default stripeService;