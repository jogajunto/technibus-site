import { Media, User } from "@/payload-types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AuthorBioProps = User;

export default function AuthorBio({ image, name, role, bio }: AuthorBioProps) {
  return (
    <div className="border-secondary space-y-4 border-b pb-6">
      <div className="flex gap-4 max-sm:flex-col sm:items-center">
        <Avatar className="size-16">
          {image && <AvatarImage src={(image as Media).url!} alt={name} />}
          <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col">
          <h1 className="subheading text-brand-primary">{name}</h1>
          {role && <p className="font-semibold">{role}</p>}
        </div>
      </div>
      {bio && <p className="text-secondary">{bio}</p>}
    </div>
  );
}
