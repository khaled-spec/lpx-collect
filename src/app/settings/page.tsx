"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Shield,
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { designTokens } from "@/lib/design-tokens";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
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
  isDefault: z.boolean().default(false),
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

function PersonalInfoForm({ settings, onUpdate }: { settings: UserSettings; onUpdate: (settings: UserSettings) => void }) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: settings.personalInfo,
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onUpdate({ ...settings, personalInfo: data });
    toast.success("Personal information updated successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
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
          <Input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth")}
          />
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
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
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
          <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
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
          <p className="text-sm text-destructive">{errors.newPassword.message}</p>
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
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
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

function EmailPreferences({ settings, onUpdate }: { settings: UserSettings; onUpdate: (settings: UserSettings) => void }) {
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
          { key: "newsletter" as const, label: "Newsletter", description: "Receive weekly updates about new collectibles and features" },
          { key: "orderUpdates" as const, label: "Order Updates", description: "Get notified about order status changes and shipping updates" },
          { key: "promotions" as const, label: "Promotions", description: "Receive exclusive offers and discount codes" },
          { key: "priceAlerts" as const, label: "Price Alerts", description: "Get notified when items in your wishlist go on sale" },
          { key: "vendorUpdates" as const, label: "Vendor Updates", description: "Updates from vendors you follow" },
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

function AddressManager({ settings, onUpdate }: { settings: UserSettings; onUpdate: (settings: UserSettings) => void }) {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (data: AddressFormData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedAddresses = [...settings.addresses];
    
    if (editingIndex !== null) {
      updatedAddresses[editingIndex] = data;
    } else {
      // If this is set as default, unset others
      if (data.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
      }
      updatedAddresses.push(data);
    }
    
    onUpdate({ ...settings, addresses: updatedAddresses });
    toast.success(editingIndex !== null ? "Address updated" : "Address added successfully");
    
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

  if (isAddingAddress) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">
            {editingIndex !== null ? "Edit Address" : "Add New Address"}
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAddingAddress(false);
              setEditingIndex(null);
              reset();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

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
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
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
            <Input
              id="city"
              {...register("city")}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register("state")}
              placeholder="NY"
            />
            {errors.state && (
              <p className="text-sm text-destructive">{errors.state.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              {...register("zipCode")}
              placeholder="10001"
            />
            {errors.zipCode && (
              <p className="text-sm text-destructive">{errors.zipCode.message}</p>
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
              <p className="text-sm text-destructive">{errors.country.message}</p>
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            {...register("isDefault")}
            className="rounded border-gray-300"
          />
          <Label htmlFor="isDefault">Set as default shipping address</Label>
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
            {isSubmitting ? "Saving..." : editingIndex !== null ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {settings.addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No shipping addresses saved</p>
            <Button onClick={() => setIsAddingAddress(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {settings.addresses.map((address, index) => (
              <Card key={index} className={address.isDefault ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{address.label}</p>
                        {address.isDefault && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{address.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.address}
                        {address.apartment && `, ${address.apartment}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.country}</p>
                      {address.phone && (
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(index)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={() => setIsAddingAddress(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </>
      )}
    </div>
  );
}

function PrivacySettings({ settings, onUpdate }: { settings: UserSettings; onUpdate: (settings: UserSettings) => void }) {
  const handleToggle = (key: keyof typeof settings.privacySettings) => {
    const updatedSettings = {
      ...settings,
      privacySettings: {
        ...settings.privacySettings,
        [key]: key === "profileVisibility" ? settings.privacySettings[key] : !settings.privacySettings[key],
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
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
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
          { key: "showWishlist" as const, label: "Show Wishlist", description: "Allow others to see your wishlist" },
          { key: "allowMessages" as const, label: "Allow Messages", description: "Let other users send you messages" },
          { key: "shareActivity" as const, label: "Share Activity", description: "Show your recent activity on your profile" },
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
              Permanently delete your account and all associated data. This action cannot be undone.
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
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
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

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Load settings from localStorage or use defaults
    const savedSettings = typeof window !== 'undefined' 
      ? localStorage.getItem(`lpx_settings_${user?.id}`)
      : null;
    
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return {
      personalInfo: {
        firstName: user?.name?.split(' ')[0] || "",
        lastName: user?.name?.split(' ')[1] || "",
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
      addresses: [],
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow">
        <Container className="py-8">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="mb-8">
              <h1 className={cn(designTokens.heading.h1, "mb-2")}>Account Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
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
                <TabsTrigger value="privacy" className="text-xs md:text-sm">
                  <Shield className="mr-2 h-4 w-4 hidden md:inline" />
                  Privacy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
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
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}