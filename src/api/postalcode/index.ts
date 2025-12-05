type ResponseAddress = {
  address1: string;
  address2: string;
  address3: string;
  zipcode: string;
};

type ZipcodeApiResponse = {
  status: number;
  messages: string | null;
  results: ResponseAddress[];
};

export const fetchAddress = async (postalCode: string) => {
  const res = await fetch(
    `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
  );
  if (!res.ok) {
    throw new Error("住所の取得に失敗しました");
  }
  const data: ZipcodeApiResponse = await res.json();
  return data.results[0];
};
