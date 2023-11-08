export const isTeacher = (userId?: string | null) => {
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID; // Checks if the provided userId matches the teacher's ID
}