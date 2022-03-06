import { AppCurrency } from "@keplr-wallet/types";
import { AnyWithUnpacked, UnknownMessage } from "@keplr-wallet/cosmos";
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgSend,
  MsgUndelegate,
} from "@keplr-wallet/proto-types";
import {
  renderMsgBeginRedelegate,
  renderMsgDelegate,
  renderMsgSend,
  renderMsgUndelegate,
  renderUnknownMessage,
} from "./messages";
import { Buffer } from "buffer/";

export function renderDirectMessage(
  msg: AnyWithUnpacked,
  currencies: AppCurrency[]
) {
  try {
    if (msg instanceof UnknownMessage) {
      return renderUnknownMessage(msg.toJSON());
    }

    if ("unpacked" in msg) {
      switch (msg.typeUrl) {
        case "/cosmos.bank.v1beta1.MsgSend": {
          const sendMsg = msg.unpacked as MsgSend;
          return renderMsgSend(currencies, sendMsg.amount, sendMsg.toAddress);
        }
        case "/cosmos.staking.v1beta1.MsgDelegate": {
          const delegateMsg = msg.unpacked as MsgDelegate;
          if (delegateMsg.amount) {
            return renderMsgDelegate(
              currencies,
              delegateMsg.amount,
              delegateMsg.validatorAddress
            );
          }
          break;
        }
        case "/cosmos.staking.v1beta1.MsgBeginRedelegate": {
          const redelegateMsg = msg.unpacked as MsgBeginRedelegate;
          if (redelegateMsg.amount) {
            return renderMsgBeginRedelegate(
              currencies,
              redelegateMsg.amount,
              redelegateMsg.validatorSrcAddress,
              redelegateMsg.validatorDstAddress
            );
          }
          break;
        }
        case "/cosmos.staking.v1beta1.MsgUndelegate": {
          const undelegateMsg = msg.unpacked as MsgUndelegate;
          if (undelegateMsg.amount) {
            return renderMsgUndelegate(
              currencies,
              undelegateMsg.amount,
              undelegateMsg.validatorAddress
            );
          }
          break;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  return renderUnknownMessage({
    typeUrl: msg.typeUrl || "Unknown",
    value: Buffer.from(msg.value).toString("base64"),
  });
}
