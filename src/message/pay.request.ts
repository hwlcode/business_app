export class payInfoRequest {
    subject: string;
    body: string;
    outTradeId: string;
    amount: string;
}

export class payWxPayInfoRequest {
    attach: string;
    body: string;
    out_trade_no: string;
    total_fee: number;
}
