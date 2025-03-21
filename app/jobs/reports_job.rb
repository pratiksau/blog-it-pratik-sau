# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(user_id, post_slug)
    begin
      ActionCable.server.broadcast(user_id.to_s, { message: "Starting PDF generation...", progress: 0 })

      # Rails.logger.info("Starting PDF generation for post #{post_slug}")
      post = Post.find_by!(slug: post_slug)
      current_user = User.find(user_id)
      # Rails.logger.info("Found post: #{post.title}")

      ActionCable.server.broadcast(user_id.to_s, { message: "Rendering template...", progress: 25 })

      # Rails.logger.info("Rendering template...")
      content = ApplicationController.render(
        template: "api/v1/posts/report/download",
        layout: "pdf",
        locals: { post: post }
      )
      # Rails.logger.info("Template rendered successfully")

      ActionCable.server.broadcast(user_id.to_s, { message: "Generating PDF...", progress: 50 })

      # Rails.logger.info("Generating PDF with WickedPdf...")
      pdf_blob = WickedPdf.new.pdf_from_string(content)
      # Rails.logger.info("PDF blob generated, size: #{pdf_blob.bytesize}")

      ActionCable.server.broadcast(user_id.to_s, { message: "Preparing to attach PDF to post...", progress: 75 })

      # Rails.logger.info("Attaching PDF to post...")
      if post.report.attached?
        # Rails.logger.info("Purging existing report attachment")
        post.report.purge_later
      end

      # Attach the new report to the post
      post.report.attach(
        io: StringIO.new(pdf_blob),
        filename: "post_report_#{post.slug}.pdf",
        content_type: "application/pdf"
      )

      if post.save
        # Rails.logger.info("PDF report successfully attached to post #{post.slug}")
        # Final 100% progress
        ActionCable.server.broadcast(user_id.to_s, { message: "Report is ready to be downloaded", progress: 100 })
      else
        # Rails.logger.error("Failed to save post with attached report: #{post.errors.full_messages.join(', ')}")
        ActionCable.server.broadcast(user_id.to_s, { message: "Error: Failed to save the report", progress: 0 })
      end
    rescue => e
      Rails.logger.error("Error generating PDF: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      ActionCable.server.broadcast(user_id.to_s, { message: "Error: #{e.message}", progress: 0 })
      raise
    end
  end
end
