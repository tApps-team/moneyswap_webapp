export const smartRound = (num: number) => {
  const decimal = num.toString().split('.')[1];
  if (!decimal || decimal.length <= 3) return num;
  return Number(num.toFixed(3));
};

export const normalizeRate = (in_count: number, out_count: number) => {
    // if ((in_count === 1 || out_count === 1) && in_count >= 1 && out_count >= 1) {
    //   return { in_count, out_count };
    // }
    // let res_in = in_count;
    // let res_out = out_count;
    // if (in_count < out_count) {
    //   res_in = 1;
    //   res_out = out_count / in_count;
    // }
    // else if (out_count < in_count) {
    //   res_in = in_count / out_count;
    //   res_out = 1;
    // }
    // else if (in_count === out_count) {
    //   res_in = 1;
    //   res_out = 1;
    // }
    // return {
    //   in_count: smartRound(res_in),
    //   out_count: smartRound(res_out)
    // };
    return {
      in_count: smartRound(in_count),
      out_count: smartRound(out_count)
    };
}