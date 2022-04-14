import prisma from "../../../lib/primsa";

const handler = async (req, res) => {
  const body = req.body;

  console.log(body);

  if (req.method !== "POST") {
    return res.status(403).json({ message: "Method not allowed" });
  }

  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    return res.status(403).json({ message: `You must provide the secret 🤫` });
  }

  if (email) {
    await prisma.user.create({
      data: { email },
    });

    return res.status(200).json({
      message: `User with email: ${email} has been created successfully!`,
    });
  }
};

export default handler;
