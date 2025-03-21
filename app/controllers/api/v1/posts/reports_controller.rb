# frozen_string_literal: true

class Api::V1::Posts::ReportsController < ApplicationController
  def create
    ReportsJob.perform_async(current_user.id, params[:slug])
    render json: { notice: t("in_progress", action: "Report generation") }
  end

  def download
    post = Post.find_by!(slug: params[:slug])

    unless post.report.attached?
      Rails.logger.error("No report attached to post with slug: #{params[:slug]}")
      render_error(t("not_found", entity: "report"), :not_found) and return
    end

    Rails.logger.info("Sending report for post: #{params[:slug]}")
    send_data post.report.download,
      filename: pdf_file_name,
      content_type: "application/pdf",
      disposition: "attachment"
  end

  private

    def pdf_file_name
      "post_report_#{params[:slug]}.pdf"
    end
end
