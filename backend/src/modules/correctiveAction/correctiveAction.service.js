const prisma = require("../../config/db");

exports.create = (data) =>
  prisma.correctiveAction.create({ data });

exports.findAll = (filters = {}) => {
  const { status, priority, assignedTo, sortBy, order } = filters;

  return prisma.correctiveAction.findMany({
    where: {
      ...(status   ? { status }     : {}),
      ...(priority ? { priority }   : {}),
        ...(assignedTo ? {
        assignedTo: {
          contains: assignedTo,
          mode: "insensitive",   // ← case-insensitive partial match
        }
      } : {}),
    },
    orderBy: {
      [sortBy || "createdAt"]: order === "asc" ? "asc" : "desc",
    },
  });
};

exports.findById = (id) =>
  prisma.correctiveAction.findUnique({ where: { id } });

exports.update = (id, data) =>
  prisma.correctiveAction.update({ where: { id }, data });

exports.remove = (id) =>
  prisma.correctiveAction.delete({ where: { id } });

exports.getDashboardSummary = async () => {
  const [total, open, inProgress, closed] = await Promise.all([
    prisma.correctiveAction.count(),
    prisma.correctiveAction.count({ where: { status: "OPEN" } }),
    prisma.correctiveAction.count({ where: { status: "IN_PROGRESS" } }),
    prisma.correctiveAction.count({ where: { status: "CLOSED" } }),
  ]);

  return { total, open, inProgress, closed };
};