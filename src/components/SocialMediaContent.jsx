"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SocialMediaContent = () => {
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    twitter: "",
    youtube: "",
    instagram: "",
    linkedin: "",
    telegram: "",
    threads: "",
    snapchat: "",
    reddit: "",
  });
  const [loading, setLoading] = useState(false);

  // Load existing content when component mounts
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch("/api/site-settings/social-media");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.socialMedia) {
            setSocialMedia(data.socialMedia);
          }
        }
      } catch (error) {
        console.error("Error fetching social media links:", error);
      }
    };

    fetchSocialMedia();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSocialMedia((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/site-settings/social-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ socialMedia }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Always show success message even if API response message is empty
          toast.success("Social media links updated successfully");
        } else {
          toast.error(data.message || "Failed to update social media links");
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update social media links");
      }
    } catch (error) {
      console.error("Error updating social media links:", error);
      toast.error("An error occurred while updating social media links");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12 overflow-hidden">
      <div className="card-body p-40">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <div className="row">
                  <div className="col-lg-12">
                    <p className="text-primary border-bottom">
                      <strong>Social Media Links</strong>
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="facebook"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Facebook
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="facebook"
                        placeholder="Facebook URL"
                        value={socialMedia.facebook}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="twitter"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Twitter-X
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="twitter"
                        placeholder="Twitter-X URL"
                        value={socialMedia.twitter}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="youtube"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Youtube
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="youtube"
                        placeholder="youtube URL"
                        value={socialMedia.youtube}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="instagram"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Instagram
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="instagram"
                        placeholder="Instagram URL"
                        value={socialMedia.instagram}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="linkedin"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="linkedin"
                        placeholder="Linkedin URL"
                        value={socialMedia.linkedin}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="telegram"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Telegram
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="telegram"
                        placeholder="Telegram URL"
                        value={socialMedia.telegram}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="threads"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Threads
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="threads"
                        placeholder="Threads URL"
                        value={socialMedia.threads}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="snapchat"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Snapchat
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="snapchat"
                        placeholder="Snapchat URL"
                        value={socialMedia.snapchat}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-20">
                      <label
                        htmlFor="reddit"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Reddit
                      </label>
                      <input
                        type="text"
                        className="form-control radius-8"
                        id="reddit"
                        placeholder="Reddit URL"
                        value={socialMedia.reddit}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mt-24">
              <button
                type="submit"
                className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialMediaContent;
