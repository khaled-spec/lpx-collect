"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Shield,
  CreditCard,
  Bell,
  Trash2,
  Save,
  Plus,
  Edit2,
  X,
  Check,
  AlertCircle,
  Phone,
  Building,
  Globe,
  MoreVertical,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethodsManager } from "@/components/settings/PaymentMethodsManager";
import { PaymentMethodsProvider } from "@/context/PaymentMethodsContext";
import { mockAddresses } from "@/lib/api/mock";

// Form schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  isDefault: z.boolean(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

interface UserSettings {
  personalInfo: PersonalInfoFormData;
  emailPreferences: {
    newsletter: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    priceAlerts: boolean;
    vendorUpdates: boolean;
  };
  privacySettings: {
    profileVisibility: "public" | "private";
    showWishlist: boolean;
    allowMessages: boolean;
    shareActivity: boolean;
  };
  addresses: AddressFormData[];
}

function PersonalInfoForm({
  settings,
  onUpdate,
}: {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: settings.personalInfo,
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    onUpdate({ ...settings, personalInfo: data });
    toast.success("Personal information updated successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} placeholder="John" />
          {errors.firstName && (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} placeholder="Doe" />
          {errors.lastName && (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function PasswordChangeForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    toast.success("Password changed successfully");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register("currentPassword")}
          placeholder="Enter your current password"
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          {...register("newPassword")}
          placeholder="Enter your new password"
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm your new password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Password must be at least 8 characters long
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          <Lock className="mr-2 h-4 w-4" />
          {isSubmitting ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}

function EmailPreferences({
  settings,
  onUpdate,
}: {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}) {
  const handleToggle = (key: keyof typeof settings.emailPreferences) => {
    const updatedSettings = {
      ...settings,
      emailPreferences: {
        ...settings.emailPreferences,
        [key]: !settings.emailPreferences[key],
      },
    };
    onUpdate(updatedSettings);
    toast.success("Email preferences updated");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          {
            key: "newsletter" as const,
            label: "Newsletter",
            description:
              "Receive weekly updates about new collectibles and features",
          },
          {
            key: "orderUpdates" as const,
            label: "Order Updates",
            description:
              "Get notified about order status changes and shipping updates",
          },
          {
            key: "promotions" as const,
            label: "Promotions",
            description: "Receive exclusive offers and discount codes",
          },
          {
            key: "priceAlerts" as const,
            label: "Price Alerts",
            description: "Get notified when items in your wishlist go on sale",
          },
          {
            key: "vendorUpdates" as const,
            label: "Vendor Updates",
            description: "Updates from vendors you follow",
          },
        ].map(({ key, label, description }) => (
          <Card key={key}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch
                checked={settings.emailPreferences[key]}
                onCheckedChange={() => handleToggle(key)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Update Email Frequency
        </Button>
      </div>
    </div>
  );
}

function AddressManager({
  settings,
  onUpdate,
}: {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}) {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      isDefault: false,
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let updatedAddresses = [...settings.addresses];

    if (editingIndex !== null) {
      updatedAddresses[editingIndex] = data;
    } else {
      // If this is set as default, unset others
      if (data.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }
      updatedAddresses.push(data);
    }

    onUpdate({ ...settings, addresses: updatedAddresses });
    toast.success(
      editingIndex !== null ? "Address updated" : "Address added successfully",
    );

    setIsAddingAddress(false);
    setEditingIndex(null);
    reset();
  };

  const handleEdit = (index: number) => {
    const address = settings.addresses[index];
    Object.entries(address).forEach(([key, value]) => {
      setValue(key as any, value);
    });
    setEditingIndex(index);
    setIsAddingAddress(true);
  };

  const handleDelete = (index: number) => {
    const updatedAddresses = settings.addresses.filter((_, i) => i !== index);
    onUpdate({ ...settings, addresses: updatedAddresses });
    toast.success("Address removed");
  };

  const handleSetDefault = (index: number) => {
    const updatedAddresses = settings.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    onUpdate({ ...settings, addresses: updatedAddresses });
    toast.success("Default address updated");
  };


  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      {settings.addresses.length > 0 && (
        <div className="flex justify-end items-center">
          <Button onClick={() => setIsAddingAddress(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
      )}

      {settings.addresses.length === 0 ? (
        <EmptyStates.NoAddresses onAction={() => setIsAddingAddress(true)} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {settings.addresses.map((address, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow h-64 flex flex-col"
              >
                <CardContent className="pt-6 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{address.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.fullName}
                          </p>
                        </div>
                      </div>
                      {address.isDefault && (
                        <Badge variant="default" className="gap-1">
                          <Star className="h-3 w-3" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {address.address}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p className="font-medium">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="font-medium">{address.country}</p>
                      </div>
                      {address.phone && (
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{address.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-xs text-muted-foreground">
                      Shipping address
                    </p>
                    <div className="flex items-center gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(index)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Set as Default
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(index)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(index)}
                            className="focus:text-red-600"
                            disabled={address.isDefault}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingIndex !== null
                ? "Update your shipping address details"
                : "Add a new shipping address to your account"
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  {...register("label")}
                  placeholder="Home, Office, etc."
                />
                {errors.label && (
                  <p className="text-sm text-destructive">{errors.label.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="123 Main St"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment, Suite, etc. (Optional)</Label>
              <Input
                id="apartment"
                {...register("apartment")}
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} placeholder="New York" />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} placeholder="NY" />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input id="zipCode" {...register("zipCode")} placeholder="10001" />
                {errors.zipCode && (
                  <p className="text-sm text-destructive">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  defaultValue="US"
                  onValueChange={(value) => setValue("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-destructive">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox
                checked={watch("isDefault") || false}
                onCheckedChange={(checked) => setValue("isDefault", !!checked)}
              />
              <div className="space-y-1 leading-none">
                <Label>Set as default shipping address</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingIndex(null);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting
                  ? "Saving..."
                  : editingIndex !== null
                    ? "Update Address"
                    : "Save Address"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PrivacySettings({
  settings,
  onUpdate,
}: {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}) {
  const handleToggle = (key: keyof typeof settings.privacySettings) => {
    const updatedSettings = {
      ...settings,
      privacySettings: {
        ...settings.privacySettings,
        [key]:
          key === "profileVisibility"
            ? settings.privacySettings[key]
            : !settings.privacySettings[key],
      },
    };
    onUpdate(updatedSettings);
    toast.success("Privacy settings updated");
  };

  const handleVisibilityChange = (value: "public" | "private") => {
    const updatedSettings = {
      ...settings,
      privacySettings: {
        ...settings.privacySettings,
        profileVisibility: value,
      },
    };
    onUpdate(updatedSettings);
    toast.success("Profile visibility updated");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile
                  </p>
                </div>
                <Select
                  value={settings.privacySettings.profileVisibility}
                  onValueChange={handleVisibilityChange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {[
          {
            key: "showWishlist" as const,
            label: "Show Wishlist",
            description: "Allow others to see your wishlist",
          },
          {
            key: "allowMessages" as const,
            label: "Allow Messages",
            description: "Let other users send you messages",
          },
          {
            key: "shareActivity" as const,
            label: "Share Activity",
            description: "Show your recent activity on your profile",
          },
        ].map(({ key, label, description }) => (
          <Card key={key}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch
                checked={settings.privacySettings[key]}
                onCheckedChange={() => handleToggle(key)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Mock user for frontend-only app
  const user = { id: '1', email: 'test@gmail.com', name: 'Test User' };
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Load settings from localStorage or use defaults
    const savedSettings =
      typeof window !== "undefined"
        ? localStorage.getItem(`lpx_settings_${user?.id}`)
        : null;

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Ensure addresses exist, use mock data if not present
      if (!parsed.addresses || parsed.addresses.length === 0) {
        parsed.addresses = mockAddresses;
      }
      return parsed;
    }

    return {
      personalInfo: {
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ")[1] || "",
        email: user?.email || "",
        phone: "",
        dateOfBirth: "",
      },
      emailPreferences: {
        newsletter: true,
        orderUpdates: true,
        promotions: false,
        priceAlerts: true,
        vendorUpdates: false,
      },
      privacySettings: {
        profileVisibility: "public",
        showWishlist: true,
        allowMessages: true,
        shareActivity: false,
      },
      addresses: mockAddresses,
    };
  });

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/settings");
    }
  }, [user, router]);

  useEffect(() => {
    // Save settings to localStorage whenever they change
    if (user) {
      localStorage.setItem(`lpx_settings_${user.id}`, JSON.stringify(settings));
    }
  }, [settings, user]);

  if (!user) {
    return null;
  }

  return (
    <PageLayout
      title="Account Settings"
      description="Manage your account settings and preferences"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings" },
      ]}
    >
      {/* Settings Tabs */}
      <Tabs defaultValue={tabParam || "personal"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="personal" className="text-xs md:text-sm">
            <User className="mr-2 h-4 w-4 hidden md:inline" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="password" className="text-xs md:text-sm">
            <Lock className="mr-2 h-4 w-4 hidden md:inline" />
            Password
          </TabsTrigger>
          <TabsTrigger value="email" className="text-xs md:text-sm">
            <Mail className="mr-2 h-4 w-4 hidden md:inline" />
            Email
          </TabsTrigger>
          <TabsTrigger value="addresses" className="text-xs md:text-sm">
            <MapPin className="mr-2 h-4 w-4 hidden md:inline" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs md:text-sm">
            <CreditCard className="mr-2 h-4 w-4 hidden md:inline" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs md:text-sm">
            <Shield className="mr-2 h-4 w-4 hidden md:inline" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm settings={settings} onUpdate={setSettings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordChangeForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>
                Manage your email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailPreferences settings={settings} onUpdate={setSettings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Addresses</CardTitle>
              <CardDescription>
                Manage your saved shipping addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddressManager settings={settings} onUpdate={setSettings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods for faster checkout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodsProvider>
                <PaymentMethodsManager />
              </PaymentMethodsProvider>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacySettings settings={settings} onUpdate={setSettings} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}
